// 商品架構
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少名稱']
  },
  price: {
    type: Number,
    min: [0, '價格格式錯誤'],
    required: [true, '缺少價格']
  },
  // 說明
  description: {
    type: String
  },
  image: {
    type: String
  },
  // 是否上架
  sell: {
    type: Boolean,
    default: false
  },
  // 分類
  // 如果要後台管理員可以自己管理，要單獨寫一個 model
  // 這邊就是寫成只有固定的能選
  category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['衣服', '包包'],
      message: '商品分類錯誤'
    }
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
