from fastapi import FastAPI
from chat import chat_router
from document import document_router
from pydantic import BaseModel

app = FastAPI()

# Middleware

@app.middleware("http")
async def log_request(request, next_call):
  print("Request is ", request)
  response = await next_call(request)
  print("Response Generated")
  return response

app.include_router(chat_router)
app.include_router(document_router)