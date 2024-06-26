require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
