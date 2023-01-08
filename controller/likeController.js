const { default: mongoose } = require('mongoose')
const postModel = require('../model/postModel')

exports.liked = async (req, res) => {
  console.log(req.body.postId,'sdsdfsf');
  try {
    const userId = mongoose.Types.ObjectId(req.body.userId)
    const postId = mongoose.Types.ObjectId(req.body.postId)

    // const post = await postModel.findByIdAndUpdate({_id:postId},{isLiked:true})
    // console.log(post,"kdkdkd")

    const likedUser = await postModel.findOne({
     $and:[{_id:postId},
      {likedUsers: [userId]}]
    })
    console.log(likedUser,'ooooooooooooooooo');
    if (likedUser) {
      console.log('liklikliklikliklik');
      const post = await postModel.updateOne(
        { _id:postId },
        { isLiked: false },
      )
      const unLike = await postModel.updateOne(
        {
          _id:postId,
        },
        {
          $pull: { likedUsers: [userId] },
        },
      )
      console.log(unLike ,'unlike');
      res.status(200).json({
        unLike,
        post,
      })
    } else {
      console.log('yyyyyyyyyryertyertydrgdfg');
      const post = await postModel.updateOne(
        { _id:postId },
        { isLiked: true },
      )
      const liked = await postModel.updateOne(
        {
          _id:postId
        },
        {
          $push: { likedUsers: [userId] },
        },
      )
      console.log(liked,'asdasddsadsa');
      // liked.updateOne({ isLiked: true })
      res.status(200).json({
        liked,
        post,
      })
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}
