import Header from './components/header/header.js';
import { authCheckReverse, getServerUrl, prependChild, setCookie } from './utils/function.js';

const loginData = {
    id: '',
    password: ''
};

const loginClick = async () => {
    const { id, password } = loginData;

    const helperTextElement = document.querySelector('.helperText');

    const response = await fetch(getServerUrl() + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
    });

    const result = await response.json();
    if (result[0] !== 200) {
        helperTextElement.textContent = '*입력하신 계정 정보가 정확하지 않았습니다.';
    } else {
        helperTextElement.textContent = '';
        setCookie('session', result[1], 14);
        location.href = '/index.html';
    }
};

const observeSignupData = () => {
    const { id, password } = loginData;
    const button = document.querySelector('#login');

    // id, pw값이 모두 존재하는지 확인
    if (!id || !password) {
        button.disabled = true;
        button.style.backgroundColor = '#ACA0EB';
    } else {
        button.disabled = false;
        button.style.backgroundColor = '#7F6AEE';
    }
};

const eventSet = () => {
    const loginButton = document.getElementById('login');
    loginButton.addEventListener('click', loginClick);

    const idInput = document.getElementById('id');
    const passwordInput = document.getElementById('pw');

    idInput.addEventListener('change', (e) => onChangeHandler(e, 'id'));
    passwordInput.addEventListener('change', (e) => onChangeHandler(e, 'password'));
};

const onChangeHandler = (e, uid) => {
    if (uid == 'id') {
        loginData.id = e.target.value;
    } else {
        loginData.password = e.target.value;
    }
    observeSignupData();
};
// 로그인 유무 체크. 로그인이 되어 있으면 메인 페이지로 이동
await authCheckReverse();

observeSignupData();
// 헤더 추가
prependChild(document.body, Header('전자공', 1));

eventSet();
