// 訂單
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者欄位']
  },
  products: [
    {
      product: {
        type: mongoose.ObjectId,
        ref: 'products',
        required: [true, '缺少商品欄位']
      },
      // 數量
      quantity: {
        type: Number,
        required: [true, '缺少數量欄位']
      }
    }
  ],
  // 訂單日期
  date: {
    type: Date,
    default: Date.now() // 以當下時間為戳記
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
