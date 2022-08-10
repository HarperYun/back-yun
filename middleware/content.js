// 獨立出來寫，會散在很多功能地方的驗證
// 比較方便修改，路由也要記得引用
export default (type) => {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      return res.status(400).send({ success: false, message: '資料格式錯誤' })
    }
    next()
  }
}
