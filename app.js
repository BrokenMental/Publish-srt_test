const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// upload 디렉토리의 경로
const uploadDirectory = path.join(__dirname, "public/upload");

// 재귀 함수를 사용하여 디렉토리 순회
function readDirectory(directoryPath, fileList) {
    // 디렉토리 내의 파일 목록 읽기
    const files = fs.readdirSync(directoryPath);

    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(directoryPath, files[i]);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            //console.log(`File: ${filePath}`);
            if (filePath.indexOf(".mp4") > -1) {
                const fileLocationDivideArr = filePath.split("\\");
                let fileName =
                    fileLocationDivideArr[fileLocationDivideArr.length - 1];
                fileName = fileName.substring(0, fileName.indexOf(".mp4"));

                const tempJson = {};
                tempJson.name = fileName;
                tempJson.location = filePath;
                fileList.push(tempJson);
            }
        } else if (stats.isDirectory()) {
            //console.log(`Directory: ${filePath}`);
            // 하위 디렉토리가 있는 경우 재귀 호출로 내부 파일/폴더 검색
            readDirectory(filePath, fileList);
        }
    }

    /*
    // 파일 및 폴더 분리하여 출력
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            //console.log(`File: ${filePath}`);
            if (filePath.indexOf(".mp4") > -1) {
                const fileLocationDivideArr = filePath.split("\\");
                let fileName =
                    fileLocationDivideArr[fileLocationDivideArr.length - 1];
                fileName = fileName.substring(0, fileName.indexOf(".mp4"));

                //console.log(filePath);
                fileList.name.push(fileName);
                fileList.location.push(filePath);
            }
        } else if (stats.isDirectory()) {
            //console.log(`Directory: ${filePath}`);
            // 하위 디렉토리가 있는 경우 재귀 호출로 내부 파일/폴더 검색
            readDirectory(filePath, fileList);
        }
    });
    */
}

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
