var express = require('express');
var router = express.Router();
const Post = require('../models/postsModel')
const checkIdFormat = require('../utils/checkFormat')
const resHandle = require('../utils/resHandle')

/* GET 取得全部貼文*/
router.get('/', async function (req, res, next) {
  const posts = await Post.find()
  resHandle.successHandle(res, posts)
});

/* POST 新增貼文*/
router.post('/', async function (req, res, next) {
  try {
    const newPost = await Post.create(req.body)
    resHandle.successHandle(res, newPost)
  } catch (error) {
    let errorMessage = Object.values(error.errors).map(item => item.message)
    resHandle.errorHandle(res, 400, errorMessage)
  }
});

/* Delete 刪除貼文*/
router.delete('/:id?', async function (req, res, next) {
  /* 
    若沒有給 ID，則代表刪除全部
    若有給 ID，則要先查詢是否有此資料，再做刪除
  */
  if (!req.params.id) {
    await Post.deleteMany({})
    resHandle.successHandle(res)
  } else {
    // 驗證 ID 格式是否正確
    if (!checkIdFormat.checkIdFormat(req.params.id)) {
      resHandle.errorHandle(res, 400, ['查無此 ID'])
      return
    }

    // 查詢是否有此 ID 的資料
    const hasId = await Post.findById(req.params.id)

    if (hasId) {
      await Post.findByIdAndDelete(req.params.id)
      const posts = await Post.find()
      resHandle.successHandle(res, posts)
    } else {
      resHandle.errorHandle(res, 400, ['查無此 ID'])
    }
  }
});

/* PATCH 編輯貼文*/
router.patch('/:id', async function (req, res, next) {
  try {
    // 驗證 ID 格式是否正確
    if (!checkIdFormat.checkIdFormat(req.params.id)) {
      resHandle.errorHandle(res, 400, ['查無此 ID'])
      return
    }

    // 確認是否有資料
    const hasId = await Post.findById(req.params.id)
    if (req.params.id && hasId) {

      // 若無填寫 content，則回傳錯誤
      if (!req.body.content) {
        resHandle.errorHandle(res, 400, ['貼文內容 content 未填寫'])
        return
      }
      await Post.findByIdAndUpdate(req.params.id, req.body)
      const post = await Post.findById(req.params.id)
      resHandle.successHandle(res, post)
    } else {
      resHandle.errorHandle(res, 400, ['查無此 ID'])
    }
  } catch (error) {
    resHandle.errorHandle(res, 400, error)
  }
});


module.exports = router;
