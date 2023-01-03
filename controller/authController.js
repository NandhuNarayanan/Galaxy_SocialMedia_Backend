const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const jwt = require('../utils/Token')
const asyncHandler = require('express-async-handler')
const { default: mongoose } = require('mongoose')

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body.values

  try {
    const oldUser = await userModel.findOne({ email })
    if (oldUser) return res.json({ message: 'user already exist' })
    if (!email || !password || !firstName || !lastName || !phone)
      return res.json({ message: 'all field required' })
    const hash = await bcrypt.hash(password, 10)
    const newUser = new userModel({
      email,
      password: hash,
      phone,
      firstName,
      lastName,
    })
    await newUser.save()
    const accessToken = jwt.createAccessToken(newUser._id)
    const refreshToken = jwt.createRefreshToken(newUser._id)

    await userModel.findByIdAndUpdate(newUser._id, { $push: { refreshToken } })

    res.status(201).json({ accessToken, refreshToken, newUser })
  } catch (error) {
    res.status(404).json({
      message: error,
    })
    console.log(error)
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return res.status(400).json({ message: 'all fields required' })
    const newUser = await userModel.findOne({ email })
    if (!newUser) return res.status(401).json({ message: 'invalid user' })
    const result = await bcrypt.compare(password, newUser.password)
    if (!result) return res.status(401).json({ message: 'invalid password' })
    const accessToken = jwt.createAccessToken(newUser._id)
    const refreshToken = jwt.createRefreshToken(newUser._id)
    await userModel.findByIdAndUpdate(newUser._id, { $push: { refreshToken } })
    res.status(200).json({ refreshToken, accessToken, newUser })
  } catch (error) {
    console.log(error)
  }
}

exports.refresh = asyncHandler(async (req, res) => {
  const cookie = req.headers.refresh
  if (!cookie) return res.status(401).json({ message: 'Unauthorized' })
  const refreshToken = cookie.split(' ')[1]
  const foundUser = await userModel
    .findOne({ refreshToken: refreshToken })
    .exec()
  if (!foundUser) {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (error, decoded) => {
        if (error) {
          console.log(error)
          return res.status(403)
        }
        const hacked = await userModel.findById(decoded.user).exec()
        hacked.refreshToken = []
        await hacked.save()
        return res.status(403).json({ message: 'forbidden' })
      }),
    )
    return foundUser
  }
  const newArray = foundUser.refreshToken.filter((e) => e !== refreshToken)
  JWT.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (error, decoded) => {
      if (error) {
        foundUser.refreshToken = newArray
        await foundUser.save()
        return res.status(403).json({ message: 'forbidden' })
      }
      const newRefreshToken = jwt.createRefreshToken(foundUser._id)

      const accessToken = jwt.createAccessToken(foundUser._id)
      foundUser.refreshToken = [...newArray, newRefreshToken]
      await foundUser.save()
      res.json({ refreshToken: newRefreshToken, accessToken })
    }),
  )
})

exports.getUsers = async (req, res) => {
  try {
    const user = mongoose.Types.ObjectId(req.params.id)
    const newUser = await userModel.findOne({ _id: user })
    res.status(200).json({ newUser })
  } catch (error) {
    console.log(error)
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const allUser = await userModel.find()
    res.status(200).json(allUser)
  } catch (error) {
    console.log(error)
  }
}

// exports.findSuggetion = async (req, res) => {
//   try {
//     console.log(req.body.loginUser._id,"assssss")
//     const logginedUser = mongoose.Types.ObjectId(req.body.loginUser._id)
//     // const following = await userModel.findById(id, 'following')
// //     const hiddenIds = following?.following
// //     hiddenIds?.push(id)

//     const suggetionUser = await userModel.find({$and:[{_id:{$ne:logginedUser}},{followers:{$nin:[logginedUser]}}] })

//     // const exceptFollowing = await userModel.find({
//     //   $and: [
//     //     { _id: { $ne: logginedUser } },
//     //     { followers: { $nin: [logginedUser] } },
//     //   ],
//     // })

//     console.log(suggetionUser,'......cccc.......ccccc......')
//   } catch (error) {
//     console.log(error)
//   }
// }
