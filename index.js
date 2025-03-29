const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));

app.get('/', async (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);


connectDB();

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
