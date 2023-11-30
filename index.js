document.getElementById('parse-srt-to-text-btn').onclick = e => {
    // SRT 파일 경로 설정
    const srtFilePath = "1.srt"; // 본인의 SRT 파일 경로로 변경해야 합니다.

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

        subtitles.forEach((subtitle) => {
            const subtitleElement = document.createElement("p");
            subtitleElement.textContent = subtitle.text;
            subtitlesDiv.appendChild(subtitleElement);
        });
    }
}