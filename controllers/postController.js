const util = require('util');
const cloudinary = require('cloudinary').v2;
const uploadPromise = util.promisify(cloudinary.uploader.upload);
const {Post, sequelize, Like, Comment, User} = require('../models')
const fs = require('fs')

exports.getPost = async (req, res, next) => {
    try {
        const posts = await Post.findAll(
            { 
                // where: {userId: req.user.id},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', "profileImage","createdAt"]
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    },
                    {
                        model: Like,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName',  "profileImage"]
                        }
                    }
                ],
                order: [['createdAt', 'DESC']]
            },);
        res.status(200).json({posts});
    } catch(err) {
        next(err)
    }
} 

exports.getMyPost = async (req, res, next) => {
    try {
        const posts = await Post.findAll(
            { 
                where: {userId: req.user.id},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'profileImage']
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    },
                    {
                        model: Like,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    }
                ],
                order: [['createdAt', 'DESC']]
            },);
        res.status(200).json({posts});
    } catch(err) {
        next(err)
    }
}

exports.getWriterPost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await Post.findAll(
            { 
                where: {userId: id},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'profileImage']
                    },
                    {
                        model: Comment,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    },
                    {
                        model: Like,
                        include: {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    }
                ],
                order: [['createdAt', 'DESC']]
            },);
        res.status(200).json({posts});
    } catch(err) {
        next(err)
    }
}

exports.createPost = async (req,res,next) => {
    try {
        const {title, text} = req.body;
        let result;
        console.log(req.file)
        if(req.file) {
            result = await uploadPromise(req.file.path)
            fs.unlinkSync(req.file.path);

        }
        

        const post = await Post.create({
            title: title,
            text: text,
            userId: req.user.id,
            image: result.secure_url
        })

        res.status(201).json({post})

    }catch(err){
        next(err)

    }
}

exports.updatePost = async (req, res, next) => {
    try{
        const {id} = req.params;
        let result;
        const {title, text} = req.body
        if(req.file) {
            result = await uploadPromise(req.file.path)
            fs.unlinkSync(req.file.path);

        }

        const targetPost = await Post.findOne({where: {id: id, userId: req.user.id}})
        if (!targetPost) {
            return res.status(400).json({message: 'Post not found.'})
        }
        
        await Post.update(
            {
                title: title,
                text: text,
                userId: req.user.id,
                image: result.secure_url
                // image: result
            },
            {where: {id: id, userId: req.user.id}}
        );

        res.status(201).json({message: "update post complete."})

    }catch(err) {
        next(err)
    }
}

exports.updateMyPost = async (req, res, next) => {
    try{
        const {id} = req.params;
        let result;
        const {title, text} = req.body
        if(req.file) {
            result = await uploadPromise(req.file.path)
            fs.unlinkSync(req.file.path);

        }

        const targetPost = await Post.findOne({where: {id: id, userId: req.user.id}})
        if (!targetPost) {
            return res.status(400).json({message: 'Post not found.'})
        }
        
        await Post.update(
            {
                title: title,
                text: text,
                userId: req.user.id,
                // image: result.secure_url
                
            },
            {where: {id: id, userId: req.user.id}}
        );

        res.status(201).json({message: "update post complete."})

    }catch(err) {
        next(err)
    }
}

exports.deletePost = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try{
        const {id} = req.params;
        const post = await Post.findOne({where: {id: id, userId: req.user.id}})
        const splited = post.image.split('/');
        if (!post) {
            return res.status(400).json({message: 'Post not found.'})
        }

        await Like.destroy({ where: { postId: id}}, {transaction});
        await Comment.destroy({ where: { postId: id}}, {transaction});
        await Post.destroy({ where: {id: id, userId: req.user.id}}, {transaction});
        await cloudinary.uploader.destroy(splited[splited.length - 1].split('.')[0])
        await transaction.commit();
        res.status(204).json()
    } catch(err){
        await transaction.rollback()
        next(err)
    }
}