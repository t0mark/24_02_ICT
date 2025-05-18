import Dialog from './components/dialog/dialog.js';
import Header from './components/header/header.js';
import { authCheck, deleteCookie, getCookie, getServerUrl, prependChild } from './utils/function.js';

const data = await authCheck();

prependChild(document.body, Header('전자공', 1, data.img));

const button = document.querySelector('#signupBtn');

const modifyData = {
    password: '',
    passwordCheck: ''
};

const observeData = () => {
    const { password, passwordCheck } = modifyData;

    // id, pw, pwck, nickname, profile 값이 모두 존재하는지 확인
    if (!password || !passwordCheck || password !== passwordCheck) {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    } else {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    }
};

const blurEventHandler = async (e, uid) => {
    if (uid == 'pw') {
        const value = e.target.value;
        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
        const helperElementCheck = document.querySelector(`.inputBox p[name="pwck"]`);
        if (!helperElement) return;

        if (value == '' || value == null) {
            helperElement.textContent = '*비밀번호를 입력해주세요.';
        } else if (modifyData.passwordCheck !== value) {
            helperElement.textContent = '*비밀번호가 다릅니다.';
            modifyData.password = value;
        } else {
            helperElementCheck.textContent = '';
            helperElement.textContent = '';
            modifyData.password = value;
        }
    } else if (uid == 'pwck') {
        const value = e.target.value;
        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
        const helperElementOrigin = document.querySelector(`.inputBox p[name="pw"]`);
        if (value == '' || value == null) {
            helperElement.textContent = '*비밀번호를 입력해주세요.';
        } else if (modifyData.password !== value) {
            helperElement.textContent = '*비밀번호가 다릅니다.';
            modifyData.passwordCheck = value;
        } else {
            helperElementOrigin.textContent = '';
            helperElement.textContent = '';
            modifyData.passwordCheck = value;
        }
    }
    observeData();
};

const addEventForInputElements = () => {
    const InputElement = document.querySelectorAll('input');
    InputElement.forEach((element) => {
        const id = element.id;

        element.addEventListener('blur', (e) => blurEventHandler(e, id));
    });
};
const modifyPassword = async () => {
    const { password } = modifyData;

    const res = await fetch(getServerUrl() + '/modifyPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            session: getCookie('session')
        },
        body: JSON.stringify({
            password
        })
    });
    const result = await res.json();

    if (result && result[0] == 200) {
        deleteCookie('session');
        Dialog('비밀번호 변경 성공', '변경된 비밀번호로 로그인 해주세요.', () => {
            location.href = '/login.html';
        });
    } else {
        Dialog('비밀번호 변경 실패', ``);
    }
};

button.addEventListener('click', modifyPassword);

addEventForInputElements();
observeData();
