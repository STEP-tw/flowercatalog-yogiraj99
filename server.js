const webapp = require('./webapp.js');
const http = require('http');
const fs = require('fs');
const Comments = require('./lib/comments.js');
const giveVisitorGusetBook=require('./lib/guestBook.js').giveVisitorGusetBook;
const giveUserGusetBook=require('./lib/guestBook.js').giveUserGusetBook;
const guestBookPost=require('./lib/guestBook.js').guestBookPost;
const doesExistInPublic = require('./lib/responseToFile.js').doesExistInPublic;
const giveContentInResponse = require('./lib/responseToFile.js').giveContentInResponse;

const PORT=8000;

let comments=new Comments("./data/comments.JSON");
let registered_users = [{userName:'yogi',name:'Yogiraj_Tambake'}];

let app=webapp.create();

let guestBookHandler=giveVisitorGusetBook;

let redirectSlashToIndexPage = function (req,res) {
  if (req.url=='/') res.redirect('/index.html');
}

let toS = o=>JSON.stringify(o,null,2);

timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
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

let setGuestBookHandler = function (req,res) {
  if (req.user && req.url=="/guestBook") {
    guestBookHandler=giveUserGusetBook;
  }
  return ;
}

app.use(redirectSlashToIndexPage);
app.use(loadUser);
app.use(fileServer);
app.use(logRequest);
app.use(redirectUserNotLoggedinTryingToPost);
app.use(setGuestBookHandler)

app.get("/guestBook",(req,res)=>{
  comments.loadComments();
  guestBookHandler(req,res,comments);
})

app.get("/logout",(req,res)=>{
  res.setHeader('Set-Cookie', [`logInFailed=false;Expires=${new Date(1).toUTCString()}`, `sessionid=0;Expires=${new Date(1).toUTCString()}`]);
  res.redirect("/guestBook");
  guestBookHandler=giveVisitorGusetBook;
})

app.post('/login.html',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestBook');
});

app.post("/guestBook",(req,res)=>{
  comments.loadComments();
  guestBookPost(req,res,comments);
  res.redirect("/guestBook");
})


let server=http.createServer(app);
server.listen(PORT);
console.log(`listening at ${PORT}`);
