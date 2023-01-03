require('dotenv').config()
require('./config/passport')

const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const userRoute = require('./routes/userRoute')
const postRoute = require('./routes/postRoute')
const commentRoute = require('./routes/commentRoute')
const likeRoute = require('./routes/likeRoute')
const myPostRoute = require('./routes/myPostRoute')

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public/images'))

app.use('/users', userRoute)
app.use('/posts', postRoute)
app.use('/comments', commentRoute)
app.use('/likes', likeRoute)
app.use('/myposts',myPostRoute)

app.use((req,res) => {
    res.status(404).json({message: 'resource not found on this sever.'})
});

app.use((err,req,res,next) => {
    console.log(err);
    res.status(500).json({message: err.message})
});

const port = process.env.PORT || 8000;
// app.listen(port, ()=> console.log(`sever running on port ${port}`))

db.sequelize.sync({force: false}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port ${process.env.PORT}`);
    });
});