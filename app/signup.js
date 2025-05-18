import Dialog from './components/dialog/dialog.js';
import Header from './components/header/header.js';
import { authCheckReverse, getServerUrl, prependChild, validEmail, fileToBase64 } from './utils/function.js';

const signupData = {
    id: '',
    passwordCheck: '',
    password: '',
    nickname: '',
    img: './public/icon/profile_img.png',
    imgTitle: 'basicImg'
};

const getSignupData = () => {
    const { id, password, passwordCheck, img, nickname } = signupData;

    // id, pw, pwck, nickname, profile 값이 모두 존재하는지 확인
    if (!id || !password || !passwordCheck || !nickname || !img) {
        Dialog('필수 입력 사항', '모든 값을 입력해주세요.');
        return false;
    }

    sendSignupData();
};

const sendSignupData = async () => {
    const { passwordCheck, ...props } = signupData;
    // signupData를 서버로 전송
    const response = await fetch(getServerUrl() + '/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    });

    // 서버로부터 응답을 받음
    const result = await response.json();

    // 응답이 성공적으로 왔을 경우
    if (result[0] == 200) {
        Dialog('환영합니다', '회원 가입이 완료 되었습니다.', () => {
            location.href = '/login.html';
        });
    } else {
        Dialog('회원 가입 실패', '잠시 뒤 다시 시도해 주세요');
    }
};

const signupClick = () => {
    // signup 버튼 클릭 시
    const signupBtn = document.querySelector('#signupBtn');
    signupBtn.addEventListener('click', getSignupData);
};

const changeEventHandler = async (e, uid) => {
    if (uid == 'profile') {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await fileToBase64(file);
        signupData.img = base64;
        signupData.imgTitle = file.name;
        // profile.value = base64;

        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
        helperElement.textContent = '';
    }
    observeSignupData();
};
const blurEventHandler = async (e, uid) => {
    if (uid == 'id') {
        const value = e.target.value;
        // const isValid = validEmail(value);
        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
        let isComplete = false;
        if (!helperElement) return;
        if (value == '' || value == null) {
            helperElement.textContent = '*ID를 입력해주세요.';
        // } else if (!isValid) {
        //     helperElement.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
        } else {
            const checkId = await fetch(getServerUrl() + '/checkId' + `?id=${value}`, {
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
                helperElement.textContent = '*중복된 ID 입니다.';
            }
        }
        if (isComplete) {
            signupData.id = value;
        } else {
            signupData.id = '';
        }
    } else if (uid == 'pw') {
        const value = e.target.value;
        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
        const helperElementCheck = document.querySelector(`.inputBox p[name="pwck"]`);
        if (!helperElement) return;

        if (value == '' || value == null) {
            helperElement.textContent = '*비밀번호를 입력해주세요.';
        } else if (signupData.passwordCheck !== value) {
            helperElement.textContent = '*비밀번호가 다릅니다.';
            signupData.password = value;
        } else {
            helperElementCheck.textContent = '';
            helperElement.textContent = '';
            signupData.password = value;
        }
    } else if (uid == 'pwck') {
        const value = e.target.value;
        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
        const helperElementOrigin = document.querySelector(`.inputBox p[name="pw"]`);
        if (value == '' || value == null) {
            helperElement.textContent = '*비밀번호를 입력해주세요.';
        } else if (signupData.password !== value) {
            helperElement.textContent = '*비밀번호가 다릅니다.';
            signupData.passwordCheck = value;
        } else {
            helperElementOrigin.textContent = '';
            helperElement.textContent = '';
            signupData.passwordCheck = value;
        }
    } else if (uid == 'nickname') {
        const value = e.target.value;
        const helperElement = document.querySelector(`.inputBox p[name="${uid}"]`);
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
            signupData.nickname = value;
        } else {
            signupData.nickname = '';
        }
    }
    observeSignupData();
};

const addEventForInputElements = () => {
    const InputElement = document.querySelectorAll('input');
    InputElement.forEach((element) => {
        const id = element.id;
        if (id === 'profile') element.addEventListener('change', (e) => changeEventHandler(e, id));
        if (id !== 'profile') element.addEventListener('blur', (e) => blurEventHandler(e, id));
    });
};

const observeSignupData = () => {
    const { id, password, passwordCheck, img, nickname } = signupData;
    const button = document.querySelector('#signupBtn');

    // id, pw, pwck, nickname, profile 값이 모두 존재하는지 확인
    if (!id || !password || !passwordCheck || !nickname || !img) {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    } else {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    }
};

await authCheckReverse();

prependChild(document.body, Header('전자공', 1));
observeSignupData();
addEventForInputElements();
signupClick();
