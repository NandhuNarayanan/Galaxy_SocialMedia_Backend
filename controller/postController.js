const { default: mongoose } = require('mongoose')
const postModel = require('../model/postModel')
const userModel = require('../model/userModel')

exports.post = async (req, res) => {
  try {
    console.log(req.body)
    const { url, userId,caption } = req.body
    const createPost = new postModel({ image: url, userId: userId, caption:caption })
    createPost.save()
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.getPosts = async (req, res) => {
  try {
    const Posts = await postModel
      .find()
      .populate('userId')
      .sort({ createdAt: -1 })
    res.status(200).json(Posts)
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.savedPost = async (req, res) => {
  try {
    console.log(req.body, 'save cheyyanullath vannittundeeee')
    const { SavedUserId, savePostId } = req.body
    console.log(SavedUserId)
    const findSave = await postModel.findOne({
      _id:savePostId ,
      savedPost: SavedUserId,
    })
    if (findSave) {
        console.log('ajajaja');
      const saved = await postModel.findByIdAndUpdate(
        { _id:savePostId },
        { $set: { isSaved: false } },
      )
      const unSave = await postModel.findByIdAndUpdate(
        { _id:savePostId },
        { $pull: { savedPost: SavedUserId } },
      )
      console.log(unSave, 'unlike')
      res.status(200).json({
        unSave,
        saved,
      })
    } else {
      const isSaved = await postModel.findByIdAndUpdate(
        { _id: savePostId },
        { $set: { isSaved: true } },
      )
      const savePost = await postModel.findByIdAndUpdate(
        { _id: savePostId },
        { $push: { savedPost: SavedUserId } },
      )
      console.log(savePost, 'save')
      res.status(200).json({ savePost, isSaved })
    }
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}
