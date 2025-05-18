import Dialog from './components/dialog/dialog.js';
import Header from './components/header/header.js';
import { authCheck, fileToBase64, getCookie, getQueryString, getServerUrl, prependChild } from './utils/function.js';

const submitButton = document.querySelector('#submit');
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#content');
const imageInput = document.querySelector('#image');

let isModifyMode = false;
const boardWrite = {
    title: '',
    content: '',
    img: '',
    imgTitle: ''
};
let modifyData = {};
const observeSignupData = () => {
    const { title, content } = boardWrite;
    if (!title || !content) {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#ACA0EB';
    } else {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#7F6AEE';
    }
};

// 엘리먼트 값 가져오기 title, content
const getBoardData = () => {
    return {
        title: boardWrite.title,
        content: boardWrite.content,
        img: boardWrite.img ?? undefined,
        imgTitle: boardWrite.imgTitle ?? undefined
    };
};

// 버튼 클릭시 이벤트
const addBoard = () => {
    const boardData = getBoardData();

    // boardData가 false일 경우 함수 종료
    if (!boardData) return;

    if (!isModifyMode) {
        // 게시글 작성 api 호출
        fetch(getServerUrl() + '/boards', {
            method: 'POST',
            body: JSON.stringify(boardData),
            headers: {
                'Content-Type': 'application/json',
                session: getCookie('session')
            }
        })
            .then((res) => res.json())
            .then((res) => {
                // 게시글 작성 성공시 게시판으로 이동
                if (res[0] == 200) {
                    Dialog('게시글', '게시글이 작성되었습니다.', () => {
                        window.location.href = `/board.html?id=${res[1]['message']}`;
                    });
                } else {
                    Dialog('게시글', '게시글 등록 실패');
                }
            });
    } else {
        // 게시글 작성 api 호출
        const setData = {
            ...boardData,
            id: parseInt(getQueryString('id'))
        };
        if (modifyData.imgTitle == setData.imgTitle) {
            setData.imgTitle = '';
            setData.img = '';
        }

        fetch(getServerUrl() + '/boards/modify', {
            method: 'POST',
            body: JSON.stringify(setData),
            headers: {
                'Content-Type': 'application/json',
                session: getCookie('session')
            }
        })
            .then((res) => res.json())
            .then((res) => {
                // 게시글 작성 성공시 게시판으로 이동
                if (res[0] == 200) {
                    Dialog('게시글', '게시글이 수정 되었습니다.', () => {
                        window.location.href = `/board.html?id=${getQueryString('id')}`;
                    });
                } else {
                    Dialog('게시글', '게시글 수정 실패');
                }
            });
    }
};
const changeEventHandler = async (e, uid) => {
    if (uid == 'title' || uid == 'content') {
        const value = e.target.value;
        if (!value || value == '') {
            boardWrite[uid] = '';
        } else {
            boardWrite[uid] = value;
        }
    } else if (uid == 'image') {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await fileToBase64(file, true);
        boardWrite.img = base64;
        boardWrite.imgTitle = file.name;
    }

    observeSignupData();
};
// 수정모드시 사용하는 게시글 단건 정보 가져오기
const getBoardModifyData = async (id) => {
    const response = await fetch(getServerUrl() + `/boards/${id}`, { noCORS: true });
    const data = await response.json();
    return data;
};

// 수정 모드인지 확인
const checkModifyMode = () => {
    const id = getQueryString('id');
    if (!id) return false;
    return id;
};

// 이벤트 등록
const addEvent = () => {
    submitButton.addEventListener('click', addBoard);
    titleInput.addEventListener('change', (e) => changeEventHandler(e, 'title'));
    contentInput.addEventListener('change', (e) => changeEventHandler(e, 'content'));
    imageInput.addEventListener('change', (e) => changeEventHandler(e, 'image'));
};

const setModifyData = (data) => {
    titleInput.value = data.title;
    contentInput.value = data.content;
    const profileImage = new File([data.img], data.imgTitle, { type: '' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(profileImage);
    imageInput.files = dataTransfer.files;

    boardWrite.title = data.title;
    boardWrite.content = data.content;
    boardWrite.img = data.img;
    boardWrite.imgTitle = data.imgTitle;

    observeSignupData();
};

const data = await authCheck();
prependChild(document.body, Header('전자공', 1, data.img));

const modifyId = checkModifyMode();
if (modifyId) {
    isModifyMode = true;
    modifyData = await getBoardModifyData(modifyId);

    if (data.idx !== modifyData.writerId) {
        Dialog('권한 없음', '권한이 없습니다.', () => {
            window.location.href = '/';
        });
    } else {
        setModifyData(modifyData);
    }
}

addEvent();
