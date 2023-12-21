const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// 재귀 함수를 사용하여 디렉토리 순회
function readDirectory(directoryPath) {
  // 디렉토리 내의 파일 목록 읽기
  const files = fs.readdirSync(directoryPath);

  // 파일 및 폴더 분리하여 출력
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      console.log(`File: ${filePath}`);
    } else if (stats.isDirectory()) {
      console.log(`Directory: ${filePath}`);
      // 하위 디렉토리가 있는 경우 재귀 호출로 내부 파일/폴더 검색
      readDirectory(filePath);
    }
  });
}

// upload 디렉토리의 경로
const uploadDirectory = path.join(__dirname, 'public/upload');

// upload 디렉토리 내의 파일과 폴더 리스트 가져오기
readDirectory(uploadDirectory);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`${PORT} port start`);
    //express 실행: node app.js
});
