from uuid import uuid4
from pydantic import BaseModel


sessionDict = {}  # session_id : SessionData


class SessionData(BaseModel):
    id: str
    nickname: str
    idx: int
    img: str
    imgTitle: str


async def createSession(id: str, nickname: str, idx: int, img: str, imgTitle: str):
    session_id = str(uuid4())
    session_data = SessionData(
        id=id, nickname=nickname, idx=idx, img=img, imgTitle=imgTitle)
    sessionDict[session_id] = session_data
    return session_id


async def getSessionData(session_id: str):
    try:
        session_data = sessionDict[session_id]
        if not session_data:
            return False
        return session_data
    except Exception as e:
        return False
