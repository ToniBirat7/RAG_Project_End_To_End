from fastapi import APIRouter

chat_router = APIRouter()
@chat_router.get("/chat")
async def chat():
  return {"Msg" : "Hello How Are You"}