const { default: mongoose } = require('mongoose')
const { findByIdAndUpdate } = require('../model/commentModel')
const commentModel = require('../model/commentModel')

exports.comment = (async(req,res)=>{
    try {
        const {content } = req.body
        const postId = mongoose.Types.ObjectId(req.body.postId)
        const userId = mongoose.Types.ObjectId(req.body.userId)
        const commentFound = await commentModel.findOne({_id:postId})
        if (!commentFound) {
            const newComment = new commentModel({_id:postId,comments:[{userId:userId,content}]})
            newComment.save()
           return res.status(201).json({message:'commented successfully'})
        }
       const comments = await commentModel.findByIdAndUpdate(commentFound._id,{$push:{comments:{userId:userId,content}}},{new:true}).populate('comments.userId').sort({createdAt:-1})
        res.status(201).json(comments)

        
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})

// getComments

exports.getComments = (async(req,res)=> {
    try {
        const showComments = await commentModel.findOne({postId:req.params.id}).populate('comments.userId')
        res.status(200).json(showComments)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})