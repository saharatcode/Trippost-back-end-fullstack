const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        // console.log(req)
        // console.log(file)
        cb(null, '' + new Date().getTime() + "." + file.mimetype.split("/")[1]);
    }
});

//middlewere รองรับข้อมูล formdata
module.exports = multer({ storage});