const mongoose = require('mongoose');
const user = require('./user');

const VideoSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    description: {type: String},
    tags: [{type: String}],
    videoUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Video', VideoSchema);