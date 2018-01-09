const fs = require('fs');
const querystring = require('querystring');


const redirectToGuestBook = function (res) {
  res.statusCode=302;
  res.setHeader("Location","guestBook");
  res.end();
}

const getCommentDetails = function (data) {
  let commentData=data.toString();
  let commentString=commentData.slice(commentData.indexOf("?")+1);
  let commentDetails=querystring.parse(commentString);
  commentDetails.dateTime=new Date().toGMTString();
  return commentDetails;
}

const isValidComment = function (commentDetails) {
  let name=commentDetails.name;
  let comment=commentDetails.comment;
  return name!=""||comment!="";
}

const handlePostMethod = function (req,res,comments) {
  req.on("data",(data)=>{
    let commentDetails=getCommentDetails(data);
    if (isValidComment(commentDetails)) {
      comments.storeComment(commentDetails);
    }
    redirectToGuestBook(res);
  })
}

const giveGuestBookInResponse = function (res,guestBookTemplate,comments) {
  let commentsAsHtml=comments.toHtml();
  let content=guestBookTemplate.replace(/COMMENTS/,commentsAsHtml)
  res.statusCode=200;
  res.setHeader("Content-Type","text/html")
  res.write(content);
  res.end();
}

const guestBookSync = function (res,comments) {
  let guestBookTemplate=fs.readFileSync("./templates/guestBookTemplate.html","utf8");
  giveGuestBookInResponse(res,guestBookTemplate,comments);
}

exports.guestBookSync = guestBookSync;
