var express = require('express')
var router = express.Router()
var articleModel = require('../db/articleModel')
var multiparty = require('multiparty')

var fs = require('fs')

//首页路由
router.post('/write',(req,res,next)=>{
    let createTime = Date.now()
    
  
let{ title,content,username,id }= req.body

  if(id){
      //修改
      id = Object(id)
      articleModel.updateOne({_id:id},{createTime,title}).then((data)=>{
          res.redirect('/')
      }).catch(err=>{
          res.redirect('/write')
      })
  }else{
      //新增
      //插入数据库//用户名
        let username = req.session.username
      articleModel.insertMany({title,content,createTime,username}).then((data)=>{
    //入库成功
    // res.send('文章发表成功')
    res.redirect('/')
}).catch((err)=>{
    // res.send('文章发表失败')
    res.redirect('/write')
})
// res.send({ title,content})

  }

})

router.post('/upload',(req,res,next)=>{
    var form = new multiparty.Form()
    form.parse(req,(err,field,files)=>{
        if(err){
            console.log('文件上传失败')
        }else{
            var file =files.filedata[0]
            //读取流
            var read = fs.createReadStream(file.path)
            
            //写入流
            var write = fs.createWriteStream('./public/imgs/'+file.originalFilename)
            console.log(file.originalFilename)
            //管道流，图片写入指定路径
            read.pipe(write)
            write.on('close',()=>{
                res.send({err:0,msg:'/imgs/'+file.originalFilename})
            })
            // write.on('close',()=>{
            //     res.send({err:0,msg:'/imgs/'+file.originalFilename})
            // })
        }
    })
})
//删除文章
router.get('/delete',(req,res,next)=>{
    let id = req.query.id
    id = new Object(id)
    // res.send(id)
    articleModel.deleteOne({_id:id}).then((data)=>{
        res.redirect('/')
    }).catch(err=>{
        res.redirect('/')
    })
})
module.exports = router;