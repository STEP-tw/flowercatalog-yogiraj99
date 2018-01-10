const fs = require('fs');

const addDateTimeToDetails = function (comment) {
  comment.dateTime=new Date().toGMTString();
  return comment;
}

const isValidComment = function (commentDetails) {
  let name=commentDetails.name;
  let comment=commentDetails.comment;
  return name!=""||comment!="";
}

const guestBookPost = function (req,res,comments) {
  let commentDetails=addDateTimeToDetails(req.body);
  if (isValidComment(commentDetails)) {
    comments.storeComment(commentDetails);
  }
  return ;
}

const giveGuestBookInResponse = function (res,guestBookTemplate,comments) {
  let commentsAsHtml=comments.toHtml();
  let content=guestBookTemplate.replace(/COMMENTS/,commentsAsHtml)
  res.statusCode=200;
  res.setHeader("Content-Type","text/html")
  res.write(content);
  res.end();
}

let commentForm =
fs.readFileSync("./templates/commentFormTemplate.html","utf8");

const loginLink = "<a href='/login.html'>login</a>";

const giveUserGusetBook = function (req,res,comments) {
  let guestBookTemplate=fs.readFileSync("./templates/guestBookTemplate.html","utf8");
  guestBookTemplate=guestBookTemplate.replace(/OPTION/,commentForm)
  giveGuestBookInResponse(res,guestBookTemplate,comments);
}

const giveVisitorGusetBook = function (req,res,comments) {
  let guestBookTemplate=fs.readFileSync("./templates/guestBookTemplate.html","utf8");
  guestBookTemplate=guestBookTemplate.replace(/OPTION/,loginLink);
  giveGuestBookInResponse(res,guestBookTemplate,comments);
}

exports.giveUserGusetBook = giveUserGusetBook;
exports.giveVisitorGusetBook = giveVisitorGusetBook;
exports.guestBookPost = guestBookPost;
