import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createProduct,
  getProducts,
  getAllProducts,
  getProduct,
  editProduct,
  getStone,
  getWax,
  getCloth,
  getWeave
} from '../controllers/products.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createProduct)
router.get('/', getProducts) // 只顯示已上架
router.get('/all', auth.jwt, admin, getAllProducts) // 包含未上架，只有管理員有權限看，一定要放在 '/:id' 這行前面，不然會失效
router.get('/:id', getProduct)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editProduct) // 編輯
router.get('/getstone', getStone) // 找天然石手鍊分類
router.get('/getwax', getWax) // 找蠟線編繩分類
router.get('/getcloth', getCloth) // 找布品手作分類
router.get('/getweave', getWeave) // 找棉麻編織分類

export default router
