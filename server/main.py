from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import board, user, comment

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(board.router)
app.include_router(user.router)
app.include_router(comment.router)
