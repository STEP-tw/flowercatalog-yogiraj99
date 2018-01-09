const webapp = require('./webapp.js');
const http = require('http');
const fs = require('fs');
const Comments = require('./lib/comments.js');
const guestBookSync=require('./lib/guestBook.js').guestBookSync;
const guestBookPost=require('./lib/guestBook.js').guestBookPost;
const doesExistInPublic = require('./lib/responseToFile.js').doesExistInPublic;
const giveContentInResponse = require('./lib/responseToFile.js').giveContentInResponse;

const PORT=8000;

let comments=new Comments("./data/comments.JSON");
let registered_users = [{userName:'yogi',name:'Yogiraj_Tambake'},{userName:'shubh',name:'Shubham_Jaybhaye'}];

let app=webapp.create();

let redirectSlashToIndexPage = function (req,res) {
  if (req.url=='/') res.redirect('/index.html');
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let fileServer = function (req,res) {
  if (doesExistInPublic(req.url)&&req.method=="GET") {
    giveContentInResponse(req.url,res);
  }
  return ;
}

let redirectUserNotLoggedinTryingToPost = function (req,res) {
  if (req.method=="POST"&&!req.user&&req.url=="/guestBook") {
    res.redirect("/login.html");
  }
}

app.use(redirectSlashToIndexPage);
app.use(loadUser);
app.use(fileServer);
app.use(redirectUserNotLoggedinTryingToPost);
app.get("/guestBook",(req,res)=>{
  comments.loadComments();
  guestBookSync(res,comments);
})

app.post('/login.html',(req,res)=>{
  console.log(req.body.userName);
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.redirect('/index.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestBook');
});
app.post("/guestBook",(req,res)=>{
  comments.loadComments();
  guestBookPost(req,res,comments)
})


let server=http.createServer(app);
server.listen(PORT);
console.log(`listening at ${PORT}`);
