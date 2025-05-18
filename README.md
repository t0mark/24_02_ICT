# edu_FastAPI_Community

학습용 FastAPI 커뮤니티 프로젝트

## 필요 라이브러리 확인 & 설치

필요 라이브러리 ./requirements.txt
설치 : pip install -r requirements.txt

## 서버 실행 명령어

### 개발 환경

uvicorn server.main:app --reload --host=0.0.0.0 --port=8088

### 배포 환경

nohup uvicorn server.main:app --reload --host=0.0.0.0 --port=8088 &

## 클라이언트 실행 명령어

python -m http.server 80 -d ./app

## 스웨거 주소

http://localhost:8088/docs

## DB 생성

CREATE DATABASE community default CHARACTER SET UTF8;

## 테이블 구조

CREATE TABLE `user` (
`id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
`password` varchar(255) DEFAULT NULL,
`nickname` varchar(255) DEFAULT NULL,
`createdAt` datetime DEFAULT NULL,
`idx` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '사용자 인덱스',
`img` longblob,
`imgTitle` varchar(255) DEFAULT NULL,
PRIMARY KEY (`idx`)
);

CREATE TABLE `board` (
`id` int NOT NULL AUTO_INCREMENT,
`title` varchar(255) DEFAULT NULL,
`content` text,
`createdAt` datetime DEFAULT NULL,
`updatedAt` datetime DEFAULT NULL,
`writerId` int DEFAULT NULL,
`viewCount` int DEFAULT NULL,
`img` longblob,
`imgTitle` varchar(255) DEFAULT NULL,
PRIMARY KEY (`id`)
);

CREATE TABLE `comment` (
`idx` int NOT NULL AUTO_INCREMENT,
`boardId` int DEFAULT NULL,
`writerId` int DEFAULT NULL,
`content` text,
`createdAt` datetime DEFAULT NULL,
PRIMARY KEY (`idx`)
);
