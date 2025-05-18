from fastapi import FastAPI, HTTPException, Depends
from typing import List
import pymysql.cursors


# SQL 함수 정의
# 사용 예시
'''
    query = "SELECT * FROM users WHERE id = %s"
    params = (user_id,)
    result = execute_sql_query(query, params)
'''


async def execute_sql_query(query: str, params: tuple = None):
    try:
        connection = pymysql.connect(
            host="localhost",
            user="tomark",
            password="woong1262!",
            db="community",
            cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            # SQL 쿼리 실행
            cursor.execute(query, params)
            result = cursor.fetchall()
            connection.commit()
            return result
    except Exception as e:
        # 강제 에러 호출
        print(e)
        connection.rollback()
        raise HTTPException(status_code=500, detail='DB 오류')
    finally:
        connection.close()
