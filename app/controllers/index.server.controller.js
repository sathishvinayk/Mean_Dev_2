exports.render=(req,res)=>{
  res.render('index',{
    title: "Hello Again!",
    message: "This is the message"
  });
};
