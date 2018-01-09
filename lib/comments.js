const Comment = require('./comment.js');
const fs = require('fs');

const Comments = function (filePath) {
  this.filePath=filePath;
  this.comments=[];
}

Comments.prototype.loadComments = function () {
  this.comments=[];
  let commentsData=fs.readFileSync(this.filePath,"utf8");
  let comments=JSON.parse(commentsData);
  let that=this;
  comments.forEach((commentDetails)=>{
    that.addComment(commentDetails);
  })
}

Comments.prototype.toHtml = function () {
  return this.comments.map((comment)=>comment.toHtml()).join("\n");
};

Comments.prototype.addComment = function (commentDetails) {
  this.comments.unshift(new Comment(commentDetails));
};

Comments.prototype.storeComment = function (commentDetails) {
  this.comments.push(new Comment(commentDetails));
  let commentsAsString=JSON.stringify(this.comments);
  fs.writeFile(this.filePath,commentsAsString,"utf8",(err)=>{
    console.log(err);
  });
}
module.exports = Comments;
