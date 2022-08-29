import express from 'express'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import {
  register,
  login,
  logout,
  extend,
  getUser,
  addCart,
  editCart,
  getCart,
  getAllUsers,
  deleteUser,
  patchUser
} from '../controllers/users.js'

const router = express.Router()

// frontend -> backend middleware(auth.jwt) -> backend(logout)
router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
router.get('/', auth.jwt, getUser)
router.patch('/', content('application/json'), auth.jwt, patchUser)
router.get('/all', auth.jwt, getAllUsers)
router.delete('/:id', auth.jwt, admin, deleteUser)

// 購物車路由 新增/取/修改
router.post('/cart', content('application/json'), auth.jwt, addCart)
router.patch('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)

export default router
