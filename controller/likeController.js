const { default: mongoose } = require('mongoose')
const postModel = require('../model/postModel')

exports.liked = async (req, res) => {
  console.log('sdsdfsf');
  try {
    const userId = mongoose.Types.ObjectId(req.body.userId)
    const postId = mongoose.Types.ObjectId(req.body.postId)

    // const post = await postModel.findByIdAndUpdate({_id:postId},{isLiked:true})
    // console.log(post,"kdkdkd")

    const likedUser = await postModel.findOne({
      postId,
      likedUsers: [userId],
    })
    if (likedUser) {
      const post = await postModel.findOneAndUpdate(
        { _id: postId },
        { isLiked: false },
      )
      const unLike = await postModel.findOneAndUpdate(
        {
          postId,
        },
        {
          $pull: { likedUsers: [userId] },
        },
      )
      console.log(unLike);
      res.status(200).json({
        unLike,
        post,
      })
    } else {
      const post = await postModel.findOneAndUpdate(
        { _id: postId },
        { isLiked: true },
      )
      const liked = await postModel.findOneAndUpdate(
        {
          postId,
        },
        {
          $push: { likedUsers: [userId] },
        },
      )
      console.log(liked);
      liked.updateOne({ isLiked: true })
      res.status(200).json({
        liked,
        post,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
