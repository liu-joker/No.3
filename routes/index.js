var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')
var moment = require('moment')
/* GET home page. */
router.get('/', function(req, res, next) {
  // articleModel.find().then((docs)=>{
    // let{ page,size } = req.query
    page = parseInt(req.query.page || 1) 
    size = parseInt(req.query.size || 2)
    let username = req.session.username
    // res.send({page,size})
    
    //第一步，查询文章总数
    articleModel.find().count().then((total)=>{
      var pages = Math.ceil(total/size);
      //第二步，分页查询
      articleModel.find().sort({'createTime':-1}).limit(size).skip((page-1)*size).then((docs)=>{
      //对数据中的时间进行处理
          var arr = docs.slice()
          for(let i=0;i<arr.length;i++){
              arr[i].createTimeZh=moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss')    }
              res.render('index', {data:{ list:arr,total:pages,username:username}});
      }).catch((err)=>{
        res.redirect('/')
      })

    
          }).catch((err)=>{
          res.redirect('/')
        })
  // })
    
 
});



//注册页面路由
router.get('/regist',function(req,res,next){
  res.render('regist',{})
})

//登录页面路由
router.get('/login',function(req,res,next){
  res.render('login',{})
})

//写文章的路由
router.get('/write',function(req,res,next){
  var id = req.query.id
  if(id){
    //编辑
    id = new Object(id)
    articleModel.findById(id).then((doc)=>{
      // res.send({data:docs})
      // doc.createTimeZh = moment(doc.createTime).format('YYYY-MM-DD HH:mm:ss')
      res.render('write',{doc:doc})
    }).catch(err=>{
      // res.send(err)
      res.redirect('/')
    })
  }else{
    //新增 
    var doc = {
      _id:'',
      username:req.username,
      title:'',
      content:''
    }
    res.render('write',{doc:doc})
  }
 
})

//详情页路由
router.get('/detail',function(req,res,next){
  var id = new Object(req.query.id)
  articleModel.findById(id).then((doc)=>{
    // res.send({data:docs})
    doc.createTimeZh = moment(doc.createTime).format('YYYY-MM-DD HH:mm:ss')
    res.render('detail',{doc:doc})
  }).catch(err=>{
    res.send(err)
  })
  // res.render('detail',{})
})


module.exports = router;
