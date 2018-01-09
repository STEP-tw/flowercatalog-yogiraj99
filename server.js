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

let app=webapp.create();

let redirectSlashToIndexPage = function (req,res) {
  if (req.url=='/') res.redirect('/index.html');
}

let fileServer = function (req,res) {
  if (doesExistInPublic(req.url)) {
    giveContentInResponse(req.url,res);
  }
}

app.use(redirectSlashToIndexPage);
app.use(fileServer);
app.get("/guestBook",(req,res)=>{
  comments.loadComments();
  guestBookSync(res,comments);
})
app.post("/guestBook",(req,res)=>{
  comments.loadComments();
  guestBookPost(req,res,comments)
})


let server=http.createServer(app);
server.listen(PORT);
console.log(`listening at ${PORT}`);
