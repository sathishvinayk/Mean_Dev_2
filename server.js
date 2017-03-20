process.env.NODE_ENV=process.env.NODE_ENV||'development';

const express=require('./config/express'),
    app=express();

app.listen(3000,()=>{
  console.log('Running on 3000');
});

module.exports=app;
