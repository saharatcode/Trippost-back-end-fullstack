const { Post, Comment, sequelize, Like } = require("../models");

exports.createComment = async (req, res, next) => {
    try{
        const {text, postId} = req.body;

        const post = await Post.findOne({where: {id: postId}});

        if(!post) {
            return res.status(400).json({message: 'post not found.'})
        }

        const comment = await Comment.create({
            text: text,
            postId: postId,
            userId: req.user.id
        });
        res.status(201).json({comment})
    } catch(err) {
        next(err)
    }
}

exports.updateComment = async (req, res, next) => {
    try{
        const {id} = req.params;
        const {text} = req.body;

        const targetComment = await Comment.findOne({where: {id: id, userId: req.user.id}})
        if(!targetComment){
            return res.status(400).json({message: 'comment not found.'})
        }
        
        await Comment.update(
            {
                text: text,
            },
            {where: {id: id, userId: req.user.id}}
        );

        res.status(201).json({message: "update comment complete."})
    }catch(err) {
        next(err)
    }
}

exports.deleteComment = async (req, res, next) => {
    
    try{
        const {id} = req.params;
        const targetComment = await Comment.findOne({where: {id: id, userId: req.user.id}})
        if (!targetComment) {
            return res.status(400).json({message: 'Comment not found.'})
        }

       await targetComment.destroy();
        //await Comment.destroy({ where: {id: id, userId: req.user.id}});
        
        res.status(204).json()
    } catch(err) {
        
        next(err)
    }
}