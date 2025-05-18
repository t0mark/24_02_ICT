export const BoardItem = (id, date, title, views, imgUrl, writer) => {
    // 파라미터 값이 없으면 리턴
    if (!date || !title || views == undefined || !imgUrl || !writer) {
        // 없는 데이터 콘솔로 출력
        // console.log(date, title, views, imgUrl, writer);
    }

    // 날짜 포맷 변경 YYYY-MM-DD hh:mm:ss
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    // 날짜 포맷 변경 YYYY-MM-DD
    let dateStr;
    if (month < 10) dateStr = `${year}-0${month}-`;
    else dateStr = `${year}-${month}-`;
    if (day < 10) dateStr = dateStr + `0` + day.toString();
    else dateStr = dateStr + day.toString();

    // 시간 포맷 변경 hh:mm:ss
    let timeStr;
    if (hours < 10) timeStr = `0${hours}:`;
    else timeStr = hours + `:`;
    if (minutes < 10) timeStr = timeStr + `0` + minutes.toString() + `:`;
    else timeStr = timeStr + minutes.toString() + `:`;
    if (seconds < 10) timeStr = timeStr + `0` + seconds.toString();
    else timeStr = timeStr + seconds.toString();

    // 날짜와 시간을 합쳐서 YYYY-MM-DD hh:mm:ss
    const dateTimeStr = `${dateStr} ${timeStr}`;

    return `
    <a href="/board.html?id=${id}">
        <div class="boardItem">
            <h2 class="title">${title}</h2>
            <div class="info">
                <h3 class="views">조회수 <b>${views}</b></h3>
                <p class="date">${dateTimeStr}</p>
            </div>
            <div class="writerInfo">
                <picture class="img">
                    <img src="${imgUrl}" alt="img">
                </picture>
                <h2 class="writer">${writer}</h2>
            </div>
        </div>
    </a>
`;
};
