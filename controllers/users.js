import users from '../models/users.js'
import products from '../models/products.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import multiparty from 'multiparty'
// import orders from '../models/orders.js'

// 註冊
// 一個一個寫 models/users.js 裡面的判定條件
export const register = async (req, res) => {
  const password = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!password.match(/^[A-Za-z0-9]+$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  req.body.password = bcrypt.hashSync(password, 10) // 加鹽
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤9' })
    }
  }
}

// 登入
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)

    await req.user.save()
    res.status(200).send({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        phonenumber: req.user.phonenumber,
        address: req.user.address,
        cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤10' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤11' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '5s' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤12' })
  }
}

// 獲取某個使用者的資料
export const getUser = async (req, res) => {
  try {
    const result = await users.findById(req.user._id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '無法獲取會員資料' })
  }
}

// 新增到購物車
export const addCart = async (req, res) => {
  try {
    // 驗證商品
    const result = await products.findById(req.body.product)
    // 沒找到或已下架
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }
    // 找購物車有沒有這個商品
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.cart[idx].quantity += req.body.quantity
    } else {
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity,
        remark: req.body.remark
      })
    }
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤14' })
    }
  }
}

export const editCart = async (req, res) => {
  try {
    if (req.body.quantity <= 0) {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $pull: {
            cart: { product: req.body.product }
          }
        }
      )
      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart.splice(idx, 1)
      // await req.user.save()
    } else {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $set: {
            // $ 代表符合陣列搜尋條件的索引
            'cart.$.quantity': req.body.quantity
          }
        }
      )
      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart[idx].quantity = req.body.quantity
      // await req.user.save()
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤15' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤16' })
  }
}

// 取得全部使用者資料
export const getAllUsers = async (req, res) => {
  try {
    const allUser = await users.find({ role: 0 })
    // const respUser = allUser.map((user) => {
    //   return {
    //     id: user.id,
    //     account: user.account,
    //     email: user.email
    //   }
    // })
    res.status(200).send({ success: true, message: '', result: allUser })
  } catch (error) {
    res.status(500).send({ success: false, message: '無法取得會員資料' })
  }
}

// 刪除使用者
export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id)
    // await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: error })
  }
}

// 修改使用者資料
export const patchUser = async (req, res) => {
  try {
    // const form = new multiparty.Form() // 能不能不用這個
    console.log(req.body)

    // form.parse(req, (err, fields, files) => {
    //   data.phonenumber = fields.phonenumber
    //   data.address = fields.address
    // })

    // 能不能在裡面設定data 外面看的到

    // console.log(data)

    // const data = {
    //   phonenumber: req.body.phonenumber,
    //   address: req.body.address
    // }
    await users.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          phonenumber: req.body.phonenumber,
          address: req.body.address
        }
      })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: error })
  }
}

// export const editProduct = async (req, res) => {
//   try {
//     const data = {
//       name: req.body.name,
//       price: req.body.price,
//       description: req.body.description,
//       image: req.file?.path,
//       sell: req.body.sell,
//       category: req.body.category
//     }
//     if (req.file) data.image = req.file.path
//     const result = await products.findByIdAndUpdate(req.params.id, data, { new: true })
//     res.status(200).send({ success: true, message: '', result })
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const key = Object.keys(error.errors)[0]
//       const message = error.errors[key].message
//       return res.status(400).send({ success: false, message })
//     } else {
//       res.status(500).send({ success: false, message: '伺服器錯誤8' })
//     }
//   }
// }
