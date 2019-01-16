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
  // 文件限制
  limits: {
    // 限制文件大小500kb
    fileSize: 500 * 1000,
    // 限制文件数量
    // files: 5
  },
  // 自定义文件格式限制
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1]
    // 只能为以下格式的图片
    if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
      cb(null, true);
    } else {
      cb(null, false)
      cb(new Error('只能上传.png或.jpg或.jpeg格式的图片'))
    }
  },
  // 储存
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // 如果没有upload文件夹则自动创建
      if (!fs.existsSync(path.join(__dirname, './uploads'))) {
        fs.mkdir('./uploads')
      }
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      const fileType = file.mimetype.split('/')[1]
      const changedName = (new Date().getTime()) + '.' + fileType;
      cb(null, changedName);
    }
  })
});

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './views/index.html'));
})


// 图片上传
let singleUpload = upload.single('files');
app.post('/upload', (req, res) => {
  singleUpload(req, res, (err) => {
    if (err || err instanceof multer.MulterError) {
      // limit中限制的
      res.json({
        code: 1,
        data: '',
        msg: err.message
      })
    } else {
      res.json({
        code: 0,
        data: req.file.path,
        msg: '上传成功'
      })
    }
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