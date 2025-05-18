import { getCookie, getServerUrl } from '../../utils/function.js';
import Dialog from '../dialog/dialog.js';

export const CommentItem = (data, writerId) => {
    const CommentDelete = () => {
        Dialog('댓글을 삭제하시겠습니까?', '삭제한 내용은 복구 할 수 없습니다.', () => {
            fetch(getServerUrl() + `/comments/${data.idx}`, {
                method: 'DELETE',
                headers: { session: getCookie('session') }
            }).then((res) => {
                if (res.ok) {
                    window.location.reload();
                } else {
                    Dialog('삭제 실패', '댓글 삭제에 실패하였습니다.');
                }
            });
        });
    };

    const CommentModify = () => {
        Dialog(
            '댓글 수정',
            data.content,
            (text) => {
                const sendData = {
                    content: text,
                    id: data.idx
                };

                fetch(getServerUrl() + `/comments/modify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', session: getCookie('session') },
                    body: JSON.stringify(sendData)
                }).then((res) => {
                    if (res.ok) {
                        window.location.reload();
                    } else {
                        Dialog('수정 실패', '댓글 수정에 실패하였습니다.');
                    }
                });
            },
            'textarea'
        );
    };

    const commentItem = document.createElement('div');
    commentItem.className = 'commentItem';

    const picture = document.createElement('picture');

    const img = document.createElement('img');
    img.className = 'commentImg';
    img.src = data.writerImg || '/public/profile_default.svg';
    picture.appendChild(img);

    const commentInfoWrap = document.createElement('div');
    commentInfoWrap.className = 'commentInfoWrap';

    const infoDiv = document.createElement('div');

    const h3 = document.createElement('h3');
    h3.textContent = data.writerNickname;
    infoDiv.appendChild(h3);

    const h4 = document.createElement('h4');
    h4.textContent = data.createdAt;
    infoDiv.appendChild(h4);

    if (data.writerId == writerId) {
        const buttonWrap = document.createElement('span');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.onclick = CommentDelete;
        const modifyButton = document.createElement('button');
        modifyButton.textContent = '수정';
        modifyButton.onclick = CommentModify;

        buttonWrap.appendChild(modifyButton);
        buttonWrap.appendChild(deleteButton);

        infoDiv.appendChild(buttonWrap);
    }

    const p = document.createElement('p');
    p.innerHTML = data.content.replace(/(?:\r\n|\r|\n)/g, '<br>');

    commentInfoWrap.appendChild(infoDiv);
    commentInfoWrap.appendChild(p);

    commentItem.appendChild(picture);
    commentItem.appendChild(commentInfoWrap);

    return commentItem;
};
