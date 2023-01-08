const fs = require('fs')
const cloudinary = require('cloudinary').v2
const {User} = require('../models')

exports.updateProfileImg = (req, res, next) => {
        cloudinary.uploader
            .upload(req.file.path, async (err, result) => {
                if(err) return next(err)
                await User.update(
                    { profileImage: result.secure_url},
                    {where: {id: req.user.id}}
                );
                if(req.user.profileImage){
                    const splited = req.user.profileImage.split('/');
                    //select by public id
                    cloudinary.uploader.destroy(splited[splited.length - 1].split('.')[0])
                }
                //delete image after oploade success
                fs.unlinkSync(req.file.path)
                res.status(201).json({message: "upload profile image complete."})
            });
};

//edith user name in profile page
exports.updateUserName = async (req,res,next) => {
    try{
        const {firstName, lastName} = req.body;
        const targeUserName = await User.findOne({where: {id: req.user.id}})
        if (!targeUserName) {
            return res.status(400).json({message: 'User not found.'})
        }

        await User.update(
            {
                firstName: firstName,
                lastName: lastName,
            },{where: {id:req.user.id}}
        );
        res.status(200).json({message: 'upload success'});
    }catch(err) {
        next(err)
    }
}

//User Profile, userId
exports.getUser = async (req,res,next) => {
    const {id} = req.params;
    try{
        const user = await User.findOne({where:{id: id}})
        res.status(200).json({user});
    }catch(err) {
        next(err)
    }
}