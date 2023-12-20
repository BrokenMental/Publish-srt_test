// SRT 파일 경로 설정
const videoFilePath = document.getElementById("video_obj").src; //"./media/Adam_Levine_Good_Mood_sub.srt";
const srtFilePath = videoFilePath.replace(".mp4", ".srt"); // SRT 파일 경로

// AJAX를 사용하여 SRT 파일 읽기
fetch(srtFilePath)
    .then((response) => response.text())
    .then((data) => {
        // SRT 파일 파싱
        const subtitles = parseSrt(data);

        // HTML에 표시
        displaySubtitles(subtitles);
    })
    .catch((error) => console.error("Error fetching the SRT file:", error));

// SRT 파일 파싱 함수
function parseSrt(srtData) {
    const subtitles = [];

    // 각 줄마다 분리하여 배열로 만듦
    const lines = srtData.split(/\r?\n/);

    let index = -1;
    lines.forEach((line) => {
        // 시간 정보를 가진 줄을 찾음
        if (/^\d+$/.test(line)) {
            index++;
            subtitles[index] = {};
        } else if (
            /^\d\d:\d\d:\d\d,\d{3} --> \d\d:\d\d:\d\d,\d{3}$/.test(line)
        ) {
            const [start, end] = line
                .split(" --> ")
                .map((time) => time.replace(",", "."));
            subtitles[index]["start"] = start;
            subtitles[index]["end"] = end;
        } else if (line.trim() === "") {
            // 빈 줄은 무시
        } else {
            if (subtitles[index]["text"]) {
                subtitles[index]["text"] += "\n" + line;
            } else {
                subtitles[index]["text"] = line;
            }
        }
    });

    return subtitles;
}

// HTML에 자막 표시 함수
function displaySubtitles(subtitles) {
    const subtitlesDiv = document.getElementById("subtitles");
    const textPrintTable = document.getElementById("text-print-table");
    let textPrintTableTbody = document.getElementById("text-print-table-tbody");

    if (textPrintTableTbody) {
        textPrintTable.removeChild(textPrintTableTbody);

        textPrintTableTbody = document.createElement("tbody");
        textPrintTableTbody.id = "text-print-table-tbody";
        textPrintTableTbody.className = "tobj";
        textPrintTable.appendChild(textPrintTableTbody);
    }

    subtitles.forEach((subtitle) => {
        // const subtitleElement = document.createElement("p");
        // subtitleElement.textContent = subtitle.text;
        // subtitlesDiv.appendChild(subtitleElement);

        const textPrintTableTr = document.createElement("tr");
        const customStartTimeArr = subtitle.start.split(':');
        const customStartTimeHour = customStartTimeArr[0] * 3600;
        const customStartTimeMinute = customStartTimeArr[1] * 60;
        const customStartTimeSecond = customStartTimeArr[2];
        const customStartTime = Number(customStartTimeHour) + Number(customStartTimeMinute) + Number(customStartTimeSecond);
        
        const customEndTimeArr = subtitle.end.split(":");
        const customEndTimeHour = customEndTimeArr[0] * 3600;
        const customEndTimeMinute = customEndTimeArr[1] * 60;
        const customEndTimeSecond = customEndTimeArr[2];
        const customEndTime =
            Number(customEndTimeHour) +
            Number(customEndTimeMinute) +
            Number(customEndTimeSecond);

        textPrintTableTr.onclick = e => {
            video_play.currentTime = customStartTime;
        }

        const textPrintTableTrTd1 = document.createElement("td");
        textPrintTableTrTd1.innerText = subtitle.text;
        textPrintTableTrTd1.id = 'st-'+customStartTime+'/'+customEndTime;
        textPrintTableTrTd1.className = 'sts';
        textPrintTableTr.appendChild(textPrintTableTrTd1);
        textPrintTableTbody.appendChild(textPrintTableTr);
    });
}

const video_play = document.getElementById("video_play");

video_play.addEventListener("timeupdate", (e) => {
    const stsList = [...document.getElementsByClassName('sts')];
    const textPrintArea = document.getElementById("text-print-area");

    stsList.forEach(sts => {
        const customPicTimeArr = sts.id.replace('st-', '').split('/');
        sts.classList.remove("blue-line");

        if (customPicTimeArr[0] <= e.target.currentTime && e.target.currentTime < customPicTimeArr[1]) {
            sts.classList.add("blue-line");
            textPrintArea.scrollTo({
                top: sts.offsetTop,
                behavior: 'smooth'
            });
            //console.log(sts.offsetTop);
        }
    });

    console.log(e.target.currentTime);
});
