const { default: mongoose } = require('mongoose')
const postModel = require('../model/postModel')
const reportModel = require('../model/reportModel')
const userModel = require('../model/userModel')
const adminModel = require('../model/userModel')
const jwt = require('../utils/Token')



exports.adminlogin = async (req, res) => {
  console.log(req.body,'req.bodyreq.bodyreq.bodyreq.body');
  const { email, password } = req.body

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'all fields required' })
    const admin = await adminModel.findOne({ email })
    if (!admin) return res.status(401).json({ message: 'invalid user' })
    const result = await bcrypt.compare(password, admin.password)
    if (!result) return res.status(401).json({ message: 'invalid password' })
    const accessToken = jwt.createAccessToken(admin._id)
    const refreshToken = jwt.createRefreshToken(admin._id)
    await adminModel.findByIdAndUpdate(admin._id, { $push: { refreshToken } })
    res.status(200).json({ refreshToken, accessToken, admin })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
    console.log(error)
  }
}

exports.getUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find()
    res.status(200).json({ allUsers })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.reportPost = async (req, res) => {
  try {
    const reportedPosts = await reportModel.find({isRemove: false}).populate({
      path: 'postId',
      populate: {
        path: 'userId',
        model: 'users',
      },
    })
    res.status(200).json({ reportedPosts })
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.removePost = async (req, res) => {
  try {
    const reportPostId = mongoose.Types.ObjectId(req.body.postId)
    await postModel.findOneAndUpdate(
      { _id: reportPostId },
      { $set: { isDeleted: true } },
    )
    await reportModel.findOneAndUpdate(
      { postId: reportPostId },
      { $set: { isRemove: true } },
    )
  } catch (error) {
    res.status(500).json(error)
    console.log(error)
  }
}

exports.declinePost = async (req, res) => {
    try {
      const declineReport = mongoose.Types.ObjectId(req.body.postId)
      
      await reportModel.findOneAndDelete(
        { postId: declineReport }
      )
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
  }


  exports.blockUser = async (req, res) => {
    try {
        console.log(req.body,'huuuuuhaaaaaaahaaaaaa');
      const blockedUserId = mongoose.Types.ObjectId(req.body.userId)
   const blockedUser =  await userModel.findOneAndUpdate(
        { _id: blockedUserId },
        { $set: { isBlocked: true } },
      )
      res.status(200).json({blockedUser})
    } catch (error) {
      res.status(500).json(error)
      console.log(error)
    }
  }