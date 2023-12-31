const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const http = require("http");
const https = require("https");
const favicon = require("serve-favicon"); //npm install serve-favicon 설치 후 진행 가능
const app = express();
const expressSanitizer = require("express-sanitizer");

//서버 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer()); //npm install --save express-sanitizer 설치 및 require 적용 후 사용 가능

//정적 디렉토리 경로 설정
app.use(express.static(path.join(__dirname, "public")));

// 특정 위치에 있는 favicon 파일 경로 설정
const faviconPath = path.join(__dirname, "public", "favicon.ico");

// upload 디렉토리의 경로
const uploadDirectory = path.join(__dirname, "public", "upload");

// favicon 설정
app.use(favicon(faviconPath));

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

//현재 os 확인
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
                const fileLocationDivideArr = filePath.split(
                    current_os === 0 ? "\\" : "/"
                );
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

const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const option = {
    key: fs.readFileSync("./99db.store/99db.store_202401022C602.key.pem"),
    cert: fs.readFileSync("./99db.store/99db.store_202401022C602.crt.pem"),
    ca: fs.readFileSync("./99db.store/RootChain/ca-chain-bundle.pem"),
};

app.listen(HTTP_PORT, () => {
    console.log(`${HTTP_PORT} port start`);
    //express 실행: node app.js
});

// https 의존성으로 새로 서버를 시작
https.createServer(option, app).listen(HTTPS_PORT, () => {
    console.log(`${HTTPS_PORT} port HTTPS start`);
});
