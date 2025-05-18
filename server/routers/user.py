from fastapi import APIRouter, Response, Depends, Header
from pydantic import BaseModel
from typing import Annotated
from ..database.query import execute_sql_query
from ..controllers.session import createSession, getSessionData
import hashlib

router = APIRouter(prefix="/api")


class Login(BaseModel):
    id: str
    password: str


class Signup(BaseModel):
    id: str
    password: str
    nickname: str
    img: str
    imgTitle: str


class Modify(BaseModel):
    nickname: str
    img: str
    imgTitle: str


class ModifyPassword(BaseModel):
    password: str

# 로그인 API id,password를 받아서 로그인 성공시 쿠키에 토큰을 저장하고, 실패시 401을 반환한다.


@router.post("/login")
async def login(data: Login, response: Response):
    # print(data.id, data.password)
    try:
        res = await execute_sql_query(
            "SELECT * FROM user WHERE id = %s and password = %s", (data.id, hashlib.sha256(data.password.encode()).hexdigest()))
        if len(res) == 0:
            return 401, {"message": "login fail"}
        else:
            userInfo = res[0]
            sessionId = await createSession(
                userInfo['id'], userInfo['nickname'], userInfo['idx'], userInfo['img'], userInfo['imgTitle'])
            return 200, sessionId
    except Exception as e:
        print(e)
        return 500, "서버 오류"

# 회원가입


@router.post('/signup')
async def signup(data: Signup):
    try:
        res = await execute_sql_query(
            "SELECT * FROM user WHERE id = %s", (data.id,))
        if len(res) != 0:
            return 401, "중복된 아이디가 있습니다."
        else:
            await execute_sql_query("INSERT INTO user (id, password, nickname, img, imgTitle) VALUES (%s, %s, %s, %s, %s)",
                                    (data.id, hashlib.sha256(data.password.encode()).hexdigest(), data.nickname, data.img, data.imgTitle))
            return 200, {"message": "signup success"}
    except Exception as e:
        print(e)
        return 500, "서버 오류"

# 세션 살아 있는지 확인하는 API


@router.get('/checkSession')
async def checkSession(session: Annotated[str, Header()] = None):
    try:
        session_data = await getSessionData(session)
        if not session_data:
            return False
        return session_data
    except Exception as e:
        return 500, "서버 오류"

# 이메일 중복 확인


@router.get('/checkId')
async def checkEmail(id: str):
    try:
        res = await execute_sql_query(
            "SELECT * FROM user WHERE id = %s", (id,))
        if len(res) != 0:
            return 401, "중복된 아이디가 있습니다."
        else:
            return 200, {"message": "중복된 아이디가 없습니다."}
    except Exception as e:
        return 500, "서버 오류"

# 닉네임 중복 확인


@router.get('/checkNickname')
async def checkNickname(nickname: str):
    try:
        res = await execute_sql_query(
            "SELECT * FROM user WHERE nickname = %s", (nickname,))
        if len(res) != 0:
            return 401, "중복된 닉네임이 있습니다."
        else:
            return 200, {"message": "중복된 닉네임이 없습니다."}
    except Exception as e:
        return 500, "서버 오류"

# 회원정보 수정, 닉네임, 이미지, 이미지 제목


@router.post('/modifyInfo')
async def updateUser(data: Modify, session: Annotated[str, Header()] = None):
    try:
        session_data = await getSessionData(session)
        if not session_data:
            return 409, "권한 없음"
        await execute_sql_query("UPDATE user SET nickname = %s, img = %s, imgTitle = %s WHERE id = %s",
                                (data.nickname, data.img, data.imgTitle, session_data.id))
        return 200, {"message": "update success"}
    except Exception as e:
        return 500, "서버 오류"

# 비밀번호 수정


@router.post('/modifyPassword')
async def updatePassword(data: ModifyPassword, session: Annotated[str, Header()] = None):
    try:
        session_data = await getSessionData(session)
        if not session_data:
            return 409, "권한 없음"
        await execute_sql_query("UPDATE user SET password = %s WHERE id = %s",
                                (hashlib.sha256(data.password.encode()).hexdigest(), session_data.id))
        return 200, {"message": "update success"}
    except Exception as e:
        print(e)
        return 500, "서버 오류"


# 회원 탈퇴
# 회원 탈퇴시 user. board. comment 기록을 모두 삭제한다.
@router.delete('/deleteAccount')
async def deleteAccount(session: Annotated[str, Header()] = None):
    try:
        session_data = await getSessionData(session)
        if not session_data:
            return 409, "권한 없음"
        await execute_sql_query("DELETE FROM user WHERE idx = %s",
                                (session_data.idx,))
        await execute_sql_query("DELETE FROM board WHERE writerId = %s",
                                (session_data.idx,))
        await execute_sql_query("DELETE FROM comment WHERE writerId = %s",
                                (session_data.idx,))
        return 200, {"message": "delete success"}
    except Exception as e:
        print(e)
        return 500, "서버 오류"
