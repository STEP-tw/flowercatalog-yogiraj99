const fs = require('fs');
const querystring = require('querystring');


const redirectToGuestBook = function (res) {
  res.statusCode=302;
  res.setHeader("Location","guestBook");
  res.end();
}

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
  redirectToGuestBook(res);
}

const giveGuestBookInResponse = function (res,guestBookTemplate,comments) {
  let commentsAsHtml=comments.toHtml();
  let content=guestBookTemplate.replace(/COMMENTS/,commentsAsHtml)
  res.statusCode=200;
  res.setHeader("Content-Type","text/html")
  res.write(content);
  res.end();
}

const commentForm = fs.readFileSync("./templates/commentFormTemplate.html");

const loginLink = "<a href='/login.html'>login</a>"

const giveUserGusetBook = function (res,comments) {
  let guestBookTemplate=fs.readFileSync("./templates/guestBookTemplate.html","utf8");
  guestBookTemplate=guestBookTemplate.replace(/OPTION/,commentForm)
  giveGuestBookInResponse(res,guestBookTemplate,comments);
}

const giveVisitorGusetBook = function (res,comments) {
  let guestBookTemplate=fs.readFileSync("./templates/guestBookTemplate.html","utf8");
  guestBookTemplate=guestBookTemplate.replace(/OPTION/,loginLink);
  giveGuestBookInResponse(res,guestBookTemplate,comments);
}


const guestBookSync = function (res,comments) {
  let guestBookTemplate=fs.readFileSync("./templates/guestBookTemplate.html","utf8");
  giveGuestBookInResponse(res,guestBookTemplate,comments);
}

exports.giveUserGusetBook = giveUserGusetBook;
exports.giveVisitorGusetBook = giveVisitorGusetBook;
exports.guestBookSync = guestBookSync;
exports.guestBookPost = guestBookPost;
