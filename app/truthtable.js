import Header from './components/header/header.js';
import { authCheck, getServerUrl, prependChild } from './utils/function.js';

// 결과 테이블을 가져옵니다.
const truthTable = document.getElementById("truthTable");

// "getResult" 버튼 클릭 시 진리표 계산 함수 실행
const getResultButton = document.getElementById("getResult");
getResultButton.addEventListener("click", calculateTruthTable);

// 진리표 계산 함수
function calculateTruthTable() {
  // 변수와 함수 입력값을 가져옵니다.
  const varsInput = document.getElementById("vars").value;
  const expressionInput = document.getElementById("expression").value;

  // 변수 입력값을 배열로 변환합니다.
  const variables = varsInput.split(",").map(variable => variable.trim());

  // 테이블 초기화
  truthTable.innerHTML = "";

  // 테이블 헤더 생성
  const headerRow = document.createElement("tr");
  for (let i = 0; i < variables.length; i++) { // 변수 순서를 역순으로 변경하지 않고 원래 순서대로 생성
    const headerCell = document.createElement("th");
    headerCell.textContent = variables[i];
    headerRow.appendChild(headerCell);
  }
  const resultHeaderCell = document.createElement("th");
  resultHeaderCell.textContent = "결과";
  headerRow.appendChild(resultHeaderCell);
  truthTable.appendChild(headerRow);

  // 진리표 계산
  const rowsCount = Math.pow(2, variables.length); // 행의 개수: 2의 변수 개수 제곱
  for (let i = 0; i < rowsCount; i++) {
    const row = document.createElement("tr");
    const cells = [];
    for (let j = 0; j < variables.length; j++) { // 변수 순서를 역순으로 변경하지 않고 원래 순서대로 생성
      const variable = variables[j];
      const cell = document.createElement("td");
      const value = (i >> (variables.length - 1 - j)) % 2; // 이진수로 변환하여 변수 값 설정
      cell.textContent = value.toString(); // 결과 값을 숫자로 설정
      cells.push(cell);
    }
    row.append(...cells);

    const expression = expressionInput.replace(/(\w+)/g, match => {
      // 변수를 입력값에 대응시킵니다.
      const variableIndex = variables.indexOf(match);
      return cells[variableIndex].textContent;
    });
    try {
      const result = eval(expression); // 입력한 함수를 계산하여 결과값을 얻습니다.
      const resultCell = document.createElement("td");
      resultCell.textContent = result ? "1" : "0"; // 결과 값을 숫자로 설정
      row.appendChild(resultCell);
    } catch (error) {
      const errorCell = document.createElement("td");
      errorCell.textContent = "오류";
      row.appendChild(errorCell);
    }
    truthTable.appendChild(row);
  }
}

const data = await authCheck();
prependChild(document.body, Header('전자공', 1, data.img));