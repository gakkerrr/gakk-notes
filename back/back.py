import os
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import uvicorn

HOST = os.getenv("HOST", "0.0.0.0")  # значение по умолчанию
PORT = int(os.getenv("PORT", 8000))

app = FastAPI()

@app.get("/")
def get_root():
    html_content = "<h2>Привет привет</h2>"
    return HTMLResponse(content=html_content)

print(f"Очень защищенные данные HOST={HOST}, PORT={PORT}")

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)