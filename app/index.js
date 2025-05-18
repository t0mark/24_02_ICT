import { BoardItem } from './components/board/boardItem.js';
import Header from './components/header/header.js';
import { authCheck, getServerUrl, prependChild } from './utils/function.js';

const getBoardItem = async () => {
    const response = await fetch(getServerUrl() + '/boards', { noCORS: true });
    const data = await response.json();

    return data;
};
const setBoardItem = async (boardData) => {
    const boardList = document.querySelector('.boardList');
    if (boardList && boardData) {
        boardList.innerHTML = boardData
            .map((data) => {
                return BoardItem(data.id, data.createdAt, data.title, data.viewCount, data.writerImg, data.writerNickname);
            })
            .join('');
    }
};

const data = await authCheck();
prependChild(document.body, Header('전자공', 0, data.img));

const boardList = await getBoardItem();
setBoardItem(boardList);
