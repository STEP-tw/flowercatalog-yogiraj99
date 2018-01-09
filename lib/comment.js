const Comment = function (commentDetails) {
  this.name=commentDetails.name;
  this.comment=commentDetails.comment;
  this.dateTime=commentDetails.dateTime;
}

Comment.prototype.toHtml = function () {
  let name=this.name;
  let comment=this.comment;
  let dateTime=this.dateTime.toLocaleString();
  return `<tr><td>${dateTime}</td><td>${name}</td><td>${comment}</td></tr>`;
};
module.exports = Comment;
