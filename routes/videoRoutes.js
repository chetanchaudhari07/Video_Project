const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Video = require('../models/video');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "video_uploads",
        resource_type: "video",
    },
});


const upload = multer({ storage: storage });

router.post("/upload",protect,upload.single("video"), async (req,res)=>{
    const {title,description,tags} = req.body;
    const NewVideo = new Video({
        user: req.user.id,
        title,
        description,
        tags: tags.split(','),
        videoUrl: req.file.path,
    });

    try {
        await NewVideo.save();
        res.status(201).json({message: "Video uploaded successfully", video: NewVideo});
    } catch (error) {
        res.status(500).json({message: "Error uploading video"});
    }

});

router.get("/user-videos", protect, async (req, res) => {
    const { title, tags, page = 1 } = req.query;
    const query = { user: req.user.id };
  
    if (title) query.title = { $regex: title, $options: "i" };
    if (tags && typeof tags === 'string') {
        query.tags = { $in: tags.split(",").map(tag => tag.trim()) };
      } else if (Array.isArray(tags)) {
        query.tags = { $in: tags };
      }
  
    const perPage = 5;
  const totalVideos = await Video.countDocuments(query);
  const videos = await Video.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage);

  res.json({ videos, totalVideos, page });
  });

  module.exports = router;