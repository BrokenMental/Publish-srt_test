const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// upload 폴더의 경로
const uploadDirectory = path.join(__dirname, 'public/upload');

// upload 폴더 내의 파일과 폴더 목록 가져오기
const filesAndFolders = fs.readdirSync(uploadDirectory);

// 파일과 폴더를 분리하여 출력
filesAndFolders.forEach(item => {
  const itemPath = path.join(uploadDirectory, item);
  const stats = fs.statSync(itemPath);

  if (stats.isFile()) {
    console.log(`File: ${item}`);
  } else if (stats.isDirectory()) {
    console.log(`Directory: ${item}`);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`${PORT} port start`);
    //express 실행: node app.js
});
