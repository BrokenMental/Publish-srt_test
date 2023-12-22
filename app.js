const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const favicon = require("serve-favicon"); //npm install serve-favicon 설치 후 진행 가능
const app = express();

//정적 디렉토리 경로 설정
app.use(express.static(path.join(__dirname, "public")));

// 특정 위치에 있는 favicon 파일 경로 설정
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');

// favicon 설정
app.use(favicon(faviconPath));

// upload 디렉토리의 경로
const uploadDirectory = path.join(__dirname, "public", "upload");

//os 정보 확인
const osConfirm = () => {
    // 운영 체제 정보 가져오기
    const platform = os.platform();

    if (platform === "win32") {
        console.log("running OS is Windows.");
        return 0;
    } else if (platform === "linux") {
        console.log("running OS is Linux.");
        return 1;
    }
};

const current_os = osConfirm();

// 재귀 함수를 사용하여 디렉토리 순회
const readDirectory = (directoryPath, fileList) => {
    // 디렉토리 내의 파일 목록 읽기
  const files = fs.readdirSync(directoryPath);

    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(directoryPath, files[i]);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            //console.log(`File: ${filePath}`);
            if (filePath.indexOf(".mp4") > -1) {
                const fileLocationDivideArr = filePath.split(current_os === 0? "\\" : "/");
                let fileName =
                    fileLocationDivideArr[fileLocationDivideArr.length - 1];
                fileName = fileName.substring(0, fileName.indexOf(".mp4"));

                const tempJson = {};
                tempJson.name = fileName;

              if (current_os === 0) {
                  //windows 일 경우
                  tempJson.location =
                      "\\upload\\" + path.relative(uploadDirectory, filePath);
              } else {
                  //linux 일 경우
                  tempJson.location =
                      "/upload/" + path.relative(uploadDirectory, filePath);
              }

                fileList.push(tempJson);
            }
        } else if (stats.isDirectory()) {
            //console.log(`Directory: ${filePath}`);
            // 하위 디렉토리가 있는 경우 재귀 호출로 내부 파일/폴더 검색
            readDirectory(filePath, fileList);
        }
    }
};

// 파일과 폴더 목록 가져오기
app.get("/list", (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            console.error("디렉토리를 읽는 중 에러 발생:", err);
            res.status(500).send("서버 에러");
            return;
        }

        // 파일과 폴더를 분리하여 Array 응답으로 전송
        const fileList = [];

        // upload 디렉토리 내의 파일과 폴더 리스트 가져오기
        readDirectory(uploadDirectory, fileList);

        res.json(fileList); // Array 형식으로 파일과 폴더 목록 응답
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`${PORT} port start`);
    //express 실행: node app.js
});
