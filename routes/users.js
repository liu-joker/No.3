var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel')

/* GET users listing. */
router.get('/', function(req, res, next) {
  // userModel.find().then((docs)=>{
  //   console.log(docs)
  // }).catch((err)=>{
  //   console.log(err,'查询失败')
  // })

  // userModel.find().then((docs)=>{
  //   res.send({data:docs,err:0,msg:'succes'})
  //   console.log(docs)
  // }).catch((err)=>{
  //   res.send({err:-1,msg:'fail',data:docs})
  //   console.log('查询失败',err)
  // })
  res.send('respond with a resource');
});
//登录接口
router.post('/regist',(req,res,next)=>{
  let{ username,password,password2} = req.body
  //查询是否存在这个用户
  userModel.find({username}).then((docs)=>{

     //数据校验工作，在这里完成

    if(docs.length>0){
      res.send('用户名已存在')
    }else{
      let createTime = Date.now()
  userModel.insertMany({username,password,createTime}).then((data)=>{
    // res.send('注册成功')
    res.redirect('/login')
  }).catch((err)=>{
    // res.send('注册失败')
    res.redirect('/regist')
  })
    }
  })
  //操作数据库
})


//注册接口
router.post('/login',(req,res,next)=>{
  let{ username,password} = req.body
  //操作数据库
 
  userModel.find({username,password}).then((docs)=>{
    if(docs.length>0){
      // res.send('登录成功')


      //登录成功后在服务端使用session记录用户信息
      req.session.username = username;
      req.session.isLogin = true;
      res.redirect('/')
    }else{
      // res.send('用户名不存在')
      res.redirect('/login')
    }
    
    // res.redirect('/login')
  }).catch((err)=>{
    res.send('登录失败')
    res.redirect('/login')
  })
})
//退出登录
router.get('/logout',(req,res,next)=>{
  req.session.username = null
  req.session.isLogin = false
  res.redirect('/login')
})
module.exports = router;
