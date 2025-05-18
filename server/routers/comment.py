from fastapi import APIRouter, Response, Depends, Header
from pydantic import BaseModel
from typing import Annotated
from ..database.query import execute_sql_query
from ..controllers.session import createSession, getSessionData
from datetime import datetime

router = APIRouter(prefix="/api")


class Comment(BaseModel):
    boardId: int
    content: str


class CommentUpdate(BaseModel):
    id: int
    content: str
# 댓글 추가 API


@router.post("/comments")
async def addComment(data: Comment, session: Annotated[str, Header()] = None):
    info = await getSessionData(session)
    today = datetime.today()

    if info is None:
        return 401, {"message": "로그인이 필요합니다."}

    # 댓글 추가 로직
    res = await execute_sql_query("INSERT INTO comment (boardId, content, writerId, createdAt) VALUES (%s, %s, %s, %s)", (data.boardId, data.content, info.idx, today))
    if res is None:
        return 400, {"message": "댓글 추가에 실패하였습니다."}
    else:
        return 200, {'message': '댓글이 추가되었습니다.'}


# 댓글 삭제 API
@router.delete("/comments/{id}")
async def deleteComment(id: int, session: Annotated[str, Header()] = None):
    info = await getSessionData(session)
    if info is None:
        return 401, {"message": "로그인이 필요합니다."}
    # 댓글 삭제 로직
    res = await execute_sql_query("DELETE FROM comment WHERE idx = %s AND writerId = %s", (id, info.idx))
    if res is None:
        return 400, {"message": "댓글 삭제에 실패하였습니다."}
    elif res == 500:
        return 500, {'message': res}
    else:
        return 200, {'message': '댓글이 삭제되었습니다.'}

# 댓글 수정 API


@router.post("/comments/modify")
async def modifyComment(data: CommentUpdate, session: Annotated[str, Header()] = None):
    info = await getSessionData(session)
    if info is None:
        return 401, {"message": "로그인이 필요합니다."}
    # 댓글 수정 로직
    res = await execute_sql_query("UPDATE comment SET content = %s WHERE idx = %s AND writerId = %s", (data.content, data.id, info.idx))
    if res is None:
        return 400, {"message": "댓글 수정에 실패하였습니다."}
    else:
        return 200, {'message': '댓글이 수정되었습니다.'}

# 댓글 목록 불러오기


@router.get("/comments/{boardId}")
async def getComment(boardId: int):
    # 댓글 목록 불러오기 로직
    comments = await execute_sql_query("SELECT c.idx AS idx, c.content AS content, c.writerId AS writerId, c.createdAt AS createdAt, u.nickname  AS writerNickname, u.img AS writerImg FROM comment AS c left join user AS u ON c.writerId = u.idx WHERE  c.boardId = %s ORDER  BY c.createdAt DESC ", (boardId,))
    if comments is None:
        return 400, {"message": "댓글 목록 불러오기에 실패하였습니다."}
    else:
        return 200, {'message': comments}
