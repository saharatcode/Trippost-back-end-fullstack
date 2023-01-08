const {Like, Post} = require('../models')
exports.createLike = async (req, res, next) => {
    try{
        const {postId} = req.body;

        const post = await Post.findOne({where: {id: postId}});

        if(!post) {
            return res.status(400).json({message: 'post not found.'})
        }

        const liked = await Like.findOne({where: {postId, userId: req.user.id}})
        if(liked) {
            return res.status(400).json({message: 'you has aleady like this post.'})
        }

        await Like.create({
            postId: postId,
            userId: req.user.id
        });
        res.status(201).json({message: 'like success'})
    }catch(err){
        next(err)
    }
}

exports.deleteLike = async (req, res, next) => {
    try{
        const {id} = req.params;
        const targetLike = await Like.findOne({where: {postId:id, userId: req.user.id}});
         
        if(!targetLike) {
            return res.status(400).json({message: 'like not found.'})
        }

        if(req.user.id !== targetLike.userId) {
            return res.status(403).json({message: 'cannot delete this like'})
        }

        await targetLike.destroy();
        res.status(204).json();
    }catch(err){
        next(err)
    }
}

//Likes of postId
exports.getWriterLike = async (req, res, next) => {
    try {
        const {id} = req.params;
        const likes = await Like.findOne(
            { 
                where: {userId: req.user.id, postId: id},
            },);
            
        res.status(200).json({likes});
    } catch(err) {
        next(err)
    }
}