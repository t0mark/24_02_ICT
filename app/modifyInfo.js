import Dialog from './components/dialog/dialog.js';
import Header from './components/header/header.js';
import { authCheck, prependChild, fileToBase64, getServerUrl, getCookie, deleteCookie } from './utils/function.js';

const emailTextElement = document.querySelector('#id');
const nicknameInputElement = document.querySelector('#nickname');
const profileInputElement = document.querySelector('#profile');
const withdrawBtnElement = document.querySelector('#withdrawBtn');

const nicknameHelpElement = document.querySelector('.inputBox p[name="nickname"]');
const profileHelpElement = document.querySelector('.inputBox p[name="profile"]');

const modifyBtnElement = document.querySelector('#signupBtn');

const data = await authCheck();
const changeData = {
    nickname: data.nickname,
    img: data.img,
    imgTitle: data.imgTitle
};

const setData = (data) => {
    emailTextElement.textContent = data.id;
    nicknameInputElement.value = data.nickname;
    // base64 로 구성된 이미지를 input file에 넣어줌
    const profileImage = new File([data.img], data.imgTitle, { type: '' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(profileImage);
    profileInputElement.files = dataTransfer.files;
};

const observeData = () => {
    const button = document.querySelector('#signupBtn');
    if (data.nickname !== changeData.nickname || data.img !== changeData.img) {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    } else {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    }
};

const changeEventHandler = async (e, uid) => {
    if (uid == 'nickname') {
        const value = e.target.value;
        const helperElement = nicknameHelpElement;
        let isComplete = false;
        if (value == '' || value == null) {
            helperElement.textContent = '*닉네임을 입력해주세요.';
        } else if (value.length > 10) {
            helperElement.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        } else {
            const checkId = await fetch(getServerUrl() + '/checkNickname' + `?nickname=${value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = await checkId.json();
            if (res && res[0] == 200) {
                helperElement.textContent = '';
                isComplete = true;
            } else {
                helperElement.textContent = '*중복된 닉네임 입니다.';
            }
        }
        if (isComplete) {
            changeData.nickname = value;
        } else {
            changeData.nickname = '';
        }
    } else if (uid == 'profile') {
        const file = e.target.files[0];
        if (!file) {
            profileHelpElement.textContent = '*프로필 사진을 추가해주세요.';
            changeData.img = '';
            changeData.imgTitle = '';
        } else {
            const base64 = await fileToBase64(file);

            changeData.img = base64;
            changeData.imgTitle = file.name;

            profileHelpElement.textContent = '';
        }
    }

    observeData();
};

const sendModifyData = async () => {
    // if (changeData.img === '' || changeData.imgTitle === '') {
    //     Dialog('필수 정보 누락', '프로필 사진을 추가해주세요.');
    // } else 
    if (changeData.nickname === '') {
        Dialog('필수 정보 누락', '닉네임을 입력해주세요.');
    } else {
        const res = await fetch(getServerUrl() + '/modifyInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                session: getCookie('session')
            },
            body: JSON.stringify(changeData)
        });
        const data = await res.json();
        if (data[0] == 200) {
            Dialog('회원정보가 수정 성공', '회원정보가 수정되었습니다. 다시 로그인 해주세요.', () => {
                deleteCookie('session');
                location.href = '/login.html';
            });
        } else {
            Dialog('회원정보 수정 실패', '회원정보 수정에 실패했습니다.');
        }
    }
};

// 회원 탈퇴
const deleteAccount = async () => {
    const callback = async () => {
        const res = await fetch(getServerUrl() + '/deleteAccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                session: getCookie('session')
            }
        });
        const data = await res.json();
        if (data[0] == 200) {
            Dialog('회원 탈퇴 성공', '회원 탈퇴가 완료되었습니다.', () => {
                deleteCookie('session');
                location.href = '/login.html';
            });
        } else {
            Dialog('회원 탈퇴 실패', '회원 탈퇴에 실패했습니다.');
        }
    };

    Dialog('회원탈퇴 하시겠습니까?', '작성된 게시글과 댓글은 삭제 됩니다.', callback);
};

const addEvent = () => {
    nicknameInputElement.addEventListener('change', (e) => changeEventHandler(e, 'nickname'));
    profileInputElement.addEventListener('change', (e) => changeEventHandler(e, 'profile'));
    modifyBtnElement.addEventListener('click', async () => sendModifyData());
    withdrawBtnElement.addEventListener('click', async () => deleteAccount());
};

prependChild(document.body, Header('전자공', 1, data.img));
setData(data);
addEvent();
