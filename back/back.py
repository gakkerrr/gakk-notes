from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import logging
from typing import List
import uvicorn
import os

logging.basicConfig(level=logging.DEBUG)

HOST = os.getenv("HOST", "0.0.0.0")  
PORT = int(os.getenv("PORT", 8000))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NoteCreate(BaseModel):

    title: str
    content: str

class Note(NoteCreate):

    id: int
    created_at: datetime

notes_db = []

@app.get("/notes", response_model=List[Note])
def get_notes():

    return notes_db

@app.post("/notes", response_model=Note)
def create_note(note: NoteCreate):

    current_datetime = datetime.now()
    new_id = len(notes_db) + 1

    new_note = Note(
        id=new_id + 1, 
        created_at=current_datetime,
        title=note.title,
        content=note.content)
    
    logging.info(f"added new note - {repr(new_note)}")

    notes_db.append(new_note)
    return new_note

@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: int, note: NoteCreate):

    for n in notes_db:
        if n.id == note_id:
            n.title = note.title
            n.content = note.content
            return n
        
    raise HTTPException(status_code=404, detail="Note not found")

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):

    global notes_db
    notes_db = [n for n in notes_db if n.id != note_id]
    return {"ok": True}

print(f"Очень защищенные данные HOST={HOST}, PORT={PORT}")

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)