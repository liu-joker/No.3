var mongoose = require('mongoose')

//连接到本地接口27017的最小配置
mongoose.connect('mongodb://127.0.0.1/joker',{ useNewUrlParser: true , useUnifiedTopology: true } )

var db = mongoose.connection
db.on('error',(err)=>{
    console.log('连接库错误')

})
db.once('open',()=>{
    console.log('连接库成功')
})
// var mongoose = require("mongoose")
// mongoose.connect('mongodb://localhost/liu')


// var db = mongoose.connection
// db.on('error',(err)=>{
//     console.log('数据连接错误')

// })

// db.once('open',()=>{
//     console.log('数据连接成功')
// })