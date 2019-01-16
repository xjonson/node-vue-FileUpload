const express = require('express')
const fs = require('fs')
const bodyParer = require('body-parser')
const multer = require('multer')
const path = require('path')

const app = new express()

app.use(bodyParer.urlencoded({
  extended: false
}))

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      const changedName = (new Date().getTime()) + '-' + file.originalname;
      cb(null, changedName);
    }
  })
});

// 返回html页面
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './views/index.html'));
})


// 图片上传
app.post('/upload', upload.single('files'), (req, res) => {
  console.log(req.file);
  res.json({
    code: 0,
    data: req.file.path,
    msg: '上传成功'
  })
})

// 获取图片
app.get('/uploads/:name', (req, res) => {
  const name = req.params.name
  res.sendFile(path.resolve(__dirname, `./uploads/${name}`))
})


app.listen('4000', () => {
  console.log('server is running at 4000');
})