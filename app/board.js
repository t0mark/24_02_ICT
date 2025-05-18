import { CommentItem } from './components/comment/comment.js';
import Dialog from './components/dialog/dialog.js';
import Header from './components/header/header.js';
import { authCheck, getCookie, getServerUrl, prependChild } from './utils/function.js';

const getQueryString = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

const getBoardDetail = async (id) => {
    const response = await fetch(getServerUrl() + `/boards/${id}`, { noCORS: true });
    const data = await response.json();

    return data;
};

const setBoardDetail = (data) => {
    // 헤드 정보
    const titleElement = document.querySelector('.title');
    const createdAtElement = document.querySelector('.createdAt');
    const imgElement = document.querySelector('.img');
    const nicknameElement = document.querySelector('.nickname');

    titleElement.textContent = data.title;
    const date = new Date(data.createdAt);
    createdAtElement.textContent = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    imgElement.src = data.writerImg;
    nicknameElement.textContent = data.writerNickname;

    // 바디 정보
    const contentImgElement = document.querySelector('.contentImg');
    if (data.img) {
        const img = document.createElement('img');
        img.src = data.img;
        contentImgElement.appendChild(img);
    }
    const contentElement = document.querySelector('.content');
    contentElement.textContent = data.content;

    const viewCountElement = document.querySelector('.viewCount h3');
    viewCountElement.textContent = data.viewCount.toLocaleString();
};

const setBoardModify = async (data, myInfo) => {
    if (myInfo.idx === data.writerId) {
        const modifyElement = document.querySelector('.hidden');
        modifyElement.classList.remove('hidden');

        const modifyBtnElement = document.querySelector('#deleteBtn');
        modifyBtnElement.addEventListener('click', () => {
            Dialog('게시글을 삭제하시겠습니까?', '삭제한 내용은 복구 할 수 없습니다.', () => {
                fetch(getServerUrl() + `/boards/${data.id}`, {
                    method: 'DELETE',
                    headers: { session: getCookie('session') }
                }).then((res) => {
                    if (res.ok) {
                        window.location.href = '/';
                    } else {
                        Dialog('삭제 실패', '게시글 삭제에 실패하였습니다.');
                    }
                });
            });
        });

        const modifyBtnElement2 = document.querySelector('#modifyBtn');
        modifyBtnElement2.addEventListener('click', () => {
            Dialog('게시글을 수정하시겠습니까?', '확인을 누르면 수정 페이지로 이동합니다.', () => {
                window.location.href = `/board-modify.html?id=${data.id}`;
            });
        });
    }
};

const getBoardComment = async (id) => {
    const response = await fetch(getServerUrl() + `/comments/${id}`, { noCORS: true });
    const data = await response.json();

    if (data[0] != 200) return [];
    else return data[1]['message'];
};

const setBoardComment = (data, myInfo) => {
    const commentListElement = document.querySelector('.commentList');
    if (commentListElement) {
        data.map((e) => {
            const item = CommentItem(e, myInfo.idx);
            commentListElement.appendChild(item);
        });
    }

    const commentCountElement = document.querySelector('.commentCount h3');
    if (commentCountElement) {
        commentCountElement.textContent = data.length.toLocaleString();
    }
};

const addComment = async () => {
    const comment = document.querySelector('textarea').value;
    const pageId = getQueryString('id');

    const response = await fetch(getServerUrl() + `/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', session: getCookie('session') },
        body: JSON.stringify({ boardId: pageId, content: comment })
    });

    if (response.ok) {
        Dialog('댓글이 등록', '댓글이 등록되었습니다.', () => {
            window.location.reload();
        });
    } else {
        Dialog('댓글 등록 실패', '댓글 등록에 실패하였습니다.');
    }
};

const req = await fetch(getServerUrl() + '/checkSession', { headers: { session: getCookie('session') } });
const myInfo = await req.json();

const commentBtnElement = document.querySelector('.commentInputBtn');
commentBtnElement.addEventListener('click', addComment);

const data = await authCheck();
prependChild(document.body, Header('전자공', 2, data.img));

const pageId = getQueryString('id');

const pageData = await getBoardDetail(pageId);
setBoardDetail(pageData);
setBoardModify(pageData, myInfo);

getBoardComment(pageId).then((data) => setBoardComment(data, myInfo));
