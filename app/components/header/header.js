import { deleteCookie } from '../../utils/function.js';

const headerDropdownMenu = () => {
    const wrap = document.createElement('div');

    const modifyInfoLink = document.createElement('a');
    const modifyPasswordLink = document.createElement('a');
    const logoutLink = document.createElement('a');

    modifyInfoLink.textContent = '회원정보수정';
    modifyPasswordLink.textContent = '비밀번호수정';
    logoutLink.textContent = '로그아웃';

    modifyInfoLink.href = '/modifyInfo.html';
    modifyPasswordLink.href = '/modifyPassword.html';
    logoutLink.addEventListener('click', () => {
        deleteCookie('session');
        location.href = '/login.html';
    });

    wrap.classList.add('drop');

    wrap.appendChild(modifyInfoLink);
    wrap.appendChild(modifyPasswordLink);
    wrap.appendChild(logoutLink);

    return wrap;
};

// title : 헤더 타이틀
// leftBtn: 헤더 좌측 기능. 0 : None , 1: back , 2 : index
// rightBtn : 헤더 우측 기능. image 주소값 들어옴
const Header = (title, leftBtn = 0, profileImage = undefined) => {
    let leftBtnElement, rightBtnElement, headerElement, h1Element;

    if (leftBtn == 1 || leftBtn == 2) {
        leftBtnElement = document.createElement('img');
        leftBtnElement.classList.add('back');
        leftBtnElement.src = '/public/navigate_before.svg';
        if (leftBtn == 1) {
            leftBtnElement.addEventListener('click', () => history.back());
        } else {
            leftBtnElement.addEventListener('click', () => (location.href = '/'));
        }
    }

    if (profileImage) {
        rightBtnElement = document.createElement('div');
        rightBtnElement.classList.add('profile');

        const profileElement = document.createElement('img');
        profileElement.classList.add('profile');
        profileElement.loading = 'eager';
        profileElement.src = profileImage;

        const Drop = headerDropdownMenu();
        Drop.classList.add('none');

        profileElement.addEventListener('click', () => {
            Drop.classList.toggle('none');
        });

        const circuitBtn = document.createElement('button');
        circuitBtn.classList.add('circuit-button');
        const circuitImage = document.createElement('img');
        circuitImage.src = '../../public/icon/circuit.jpg';
        circuitImage.alt = 'CircuitLab';
        circuitImage.style.width = '40px';
        circuitImage.style.height = '40px';
        circuitBtn.appendChild(circuitImage);
        circuitBtn.addEventListener('click', () => {
            window.open('https://www.circuitlab.com/', '_blank');
        });

        const truthTableBtn = document.createElement('button');
        truthTableBtn.classList.add('truth-table');
        const truthTableImage = document.createElement('img');
        truthTableImage.src = '../../public/icon/truthtable.png';
        truthTableImage.alt = '진리표';
        truthTableImage.style.width = '45px';
        truthTableImage.style.height = '45px';
        truthTableBtn.appendChild(truthTableImage);
        truthTableBtn.addEventListener('click', () => {
            // 버튼 클릭 시 동작
            location.href = '/truthtable.html';
        });
        
        rightBtnElement.appendChild(circuitBtn);
        rightBtnElement.appendChild(truthTableBtn);
        rightBtnElement.appendChild(profileElement);
        rightBtnElement.appendChild(Drop);
    }

    h1Element = document.createElement('h1');
    h1Element.textContent = title;
    h1Element.addEventListener('click', () => {
        location.href = '/index.html';
    });

    headerElement = document.createElement('header');

    if (leftBtnElement) headerElement.appendChild(leftBtnElement);
    headerElement.appendChild(h1Element);
    if (rightBtnElement) headerElement.appendChild(rightBtnElement);

    return headerElement;
};

export default Header;
