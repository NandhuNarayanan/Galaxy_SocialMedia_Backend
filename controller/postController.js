const postModel = require('../model/postModel');



exports.post = (async (req,res) => {
    try {
        const{url,userId} = req.body;
        const createPost = new postModel({image:url,userId:userId})
        createPost.save()
    } catch (error) {
        console.log(error);
    }

 
})


exports.getPosts = (async(req,res)=>{

    try {
        const Posts = await postModel.find().populate('userId').sort({createdAt:-1})
        res.status(200).json(Posts)
    } catch (error) {
        console.log(error);
    }

})


