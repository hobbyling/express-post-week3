var express = require('express');
var router = express.Router();
const Post = require('../models/postsModel')

/* GET 取得全部貼文*/
router.get('/', async function (req, res, next) {
  const posts = await Post.find()
  res.status(200).json({
    "status": "success",
    "data": posts
  })
});

/* POST 新增貼文*/
router.post('/', async function (req, res, next) {
  try {
    const newPost = await Post.create(req.body)
    res.status(200).json({
      status: "success",
      post: newPost
    })
  } catch (error) {
    let errorMessage = Object.values(error.errors).map(item => item.message)
    res.status(400).json({
      status: "false",
      message: "欄位格式錯誤",
      error: errorMessage
    })
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
    res.status(200).json({
      status: "success",
      post: []
    })
  } else {
    // 查詢是否有此 ID 的資料
    const hasId = await Post.findById(req.params.id)

    if (hasId) {
      await Post.findByIdAndDelete(req.params.id)
      const posts = await Post.find()

      res.status(200).json({
        status: "success",
        post: posts
      })
    } else {
      res.status(400).json({
        status: "false",
        message: "欄位格式錯誤",
        error: ['查無此 ID']
      })
    }
  }
});

/* PATCH 編輯貼文*/
router.patch('/:id', async function (req, res, next) {
  try {
    // 先確認是否有資料
    const hasId = await Post.findById(req.params.id)
    if (req.params.id && hasId) {

      // 若無填寫 content，則回傳錯誤
      if (!req.body.content) {
        res.status(400).json({
          status: "false",
          message: "欄位格式錯誤",
          error: ['貼文內容 content 未填寫']
        })
        return
      }
      await Post.findByIdAndUpdate(req.params.id, req.body)
      const post = await Post.findById(req.params.id)
      res.status(200).json({
        "status": "success",
        "data": post
      })
    }
  } catch (error) {
    res.status(400).json({
      status: "false",
      message: "欄位格式錯誤",
      error: ['查無此 ID']
    })
  }
});

module.exports = router;
