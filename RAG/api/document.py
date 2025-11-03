from fastapi import APIRouter

document_router = APIRouter()

@document_router.post("/doc/")
async def handle_document():
  return {"Msg" : "Hello How Are You"}