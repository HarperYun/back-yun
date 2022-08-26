import products from '../models/products.js'

// 新增商品
export const createProduct = async (req, res) => {
  try {
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file?.path || '',
      sell: req.body.sell,
      category: req.body.category
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤4' })
    }
  }
}

// 搜尋已上架商品
export const getProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤5' })
  }
}

// 搜尋全部商品，包含未上架
export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤6' })
  }
}

// 以id獲取商品頁
export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤7' })
  }
}

// 編輯商品
export const editProduct = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file?.path,
      sell: req.body.sell,
      category: req.body.category
    }
    if (req.file) data.image = req.file.path
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤8' })
    }
  }
}

// '天然石手鍊', '蠟線編繩', '布品手作', '棉麻編織'
// 找天然石手鍊分類的商品
export const getStone = async (req, res) => {
  console.log('13464')
  console.log(req)
  try {
    // { category: '天然石手鍊' }
    const result = await products.find()
    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: error })
  }
}

// 找蠟線編繩分類的商品
export const getWax = async (req, res) => {
  try {
    const result = await products.find({ category: '蠟線編繩' })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤-蠟線編繩' })
  }
}

// 找布品手作分類的商品
export const getCloth = async (req, res) => {
  try {
    const result = await products.find({ category: '布品手作' })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤-布品手作' })
  }
}

// 找棉麻編織分類的商品
export const getWeave = async (req, res) => {
  try {
    const result = await products.find({ category: '棉麻編織' })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤-棉麻編織' })
  }
}
