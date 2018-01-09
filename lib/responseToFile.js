const fs = require('fs');

const setResonseHeader = function (response,url) {
  let extensions={
    ".html":"text/html",
    ".css":"text/css",
    ".js":"text/javascript",
    ".jpg":"img/jpg",
    ".gif":"img/gif",
    ".pdf":"application/pdf"
  }
  let fileExtension=url.slice(url.lastIndexOf("."))
  response.setHeader("Content-Type",`${extensions[fileExtension]}`);
  response.statusCode=200;
  return true;
}

const doesExistInPublic = function (url) {
  return fs.existsSync("./public"+url);
}

const giveContentInResponse = function (fileNeeded,response) {
  let content=fs.readFileSync(`./public${fileNeeded}`)
  setResonseHeader(response,fileNeeded);
  response.write(content,"utf8");
  response.end();
  return ;
}

exports.doesExistInPublic=doesExistInPublic;
exports.giveContentInResponse=giveContentInResponse;
