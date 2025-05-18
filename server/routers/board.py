from fastapi import APIRouter, Cookie, Header
from typing import Annotated
from pydantic import BaseModel
from typing import Optional
from ..database.query import execute_sql_query
from ..controllers.session import getSessionData
from datetime import datetime


router = APIRouter(prefix="/api")


@router.get("/boards")
async def boards():
    # 게시글 목록 조회 로직
    boards = await execute_sql_query("SELECT b.id AS id, b.title AS title, b.createdAt AS createdAt, b.viewCount as viewCount, u.nickname AS writerNickname, u.img AS writerImg FROM board AS b LEFT JOIN user AS u ON b.writerId = u.idx ORDER BY b.createdAt DESC")
    return boards


# 게시글 단건 조회
@router.get("/boards/{id}")
async def board(id: int):
    board = await execute_sql_query(
        "SELECT b.id AS id, b.title AS title, b.writerId as writerId, b.content as content,b.img as img, b.imgTitle as imgTitle, b.viewCount as viewCount, b.createdAt AS createdAt, u.nickname AS writerNickname, u.img AS writerImg FROM board AS b LEFT JOIN user AS u ON b.writerId = u.idx WHERE b.id = %s", (id,))

    # 단건 조회시 viewCount 증가 로직
    await execute_sql_query("UPDATE board SET viewCount = viewCount + 1 WHERE id = %s", (id,))
    if board is None:
        return {"message": "게시글이 존재하지 않습니다."}, 404
    else:
        return board[0]


class addBoard(BaseModel):
    title: str
    content: str
    img: Optional[str]
    imgTitle: Optional[str]


class modifyBoard(BaseModel):
    id: int
    title: str
    content: str
    img: Optional[str]
    imgTitle: Optional[str]


@router.post("/boards")
async def addBoard(data: addBoard, session: Annotated[str, Header()] = None):
    # print(data.title, data.content, data.session)
    info = await getSessionData(session)
    # print(info.idx)
    today = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    # print(today)
    # 게시글 추가 로직 board 테이블에 게시글을 추가한다.
    res = await execute_sql_query("INSERT INTO board (title, content, writerId, createdAt, img, imgTitle, viewCount) VALUES (%s, %s, %s, %s, %s, %s, %s)", (data.title, data.content, info.idx, today, data.img, data.imgTitle, 0,))

    # 게시글 마지막 idx 조회
    res = await execute_sql_query("SELECT MAX(id) AS id FROM board")

    # print(res)
    return 200, {'message': res[0]['id']}

# 게시물 삭제


@router.delete("/boards/{id}")
async def deleteBoard(id: str, session: Annotated[str, Header()] = None):

    info = await getSessionData(session)
    # 게시글 삭제 로직
    res = await execute_sql_query("DELETE FROM board WHERE id = %s AND writerId = %s", (id, info.idx,))
    # print(res)
    if (res == 0):
        return 401, {'message': '삭제 권한이 없습니다.'}
    else:
        return 200, {'message': '삭제되었습니다.'}

# 게시물 수정


@router.post("/boards/modify")
async def boardModify(data: modifyBoard, session: Annotated[str, Header()] = None):
    info = await getSessionData(session)

    if data.img == "" or data.imgTitle == '':
        res = await execute_sql_query("UPDATE board SET title = %s, content = %s WHERE id = %s AND writerId = %s", (data.title, data.content, data.id, info.idx,))
    else:
        res = await execute_sql_query("UPDATE board SET title = %s, content = %s, img = %s, imgTitle = %s WHERE id = %s AND writerId = %s", (data.title, data.content, data.img, data.imgTitle, data.id, info.idx,))

    # print(res)
    if (res == 0):
        return 401, {'message': '수정 권한이 없습니다.'}
    else:
        return 200, {'message': '수정되었습니다.'}
