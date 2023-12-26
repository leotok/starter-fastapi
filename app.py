from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import json

import boto3
s3 = boto3.client('s3')


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class Item(BaseModel):
    item_id: int


def save_song(guest, song):
    songs = get_songs()
    songs.append({"guest": guest, "song": song})
    s3.put_object(
        Body=json.dumps(songs),
        Bucket="cyclic-ruby-confused-viper-sa-east-1",
        Key="songs_list.json"
    )


def get_songs():
    try:
        songs_file = s3.get_object(
            Bucket="cyclic-ruby-confused-viper-sa-east-1",
            Key="songs_list.json"
        )
        return json.loads(songs_file['Body'].read())  
    except:
        pass
    return []


def reset_songs():
    s3.put_object(
        Body=json.dumps([]),
        Bucket="cyclic-ruby-confused-viper-sa-east-1",
        Key="songs_list.json"
    )

@app.get("/song/reset")
async def reset_songs_route(request: Request):
    reset_songs()
    return {"msg": "Songs reset"}


@app.get("/song/save")
async def save_song_route(request: Request, guest: str, song: str):
    save_song(guest, song)
    return {
        "msg": "Saved",
        "payload": {
            "guest": guest,
            "song": song,
        }
    }


@app.get("/song")
async def get_song_route(request: Request):
    return get_songs()


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", context={"request": request})


@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse('favicon.ico')


@app.get("/item/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}


@app.get("/items/")
async def list_items():
    return [{"item_id": 1, "name": "Foo"}, {"item_id": 2, "name": "Bar"}]


@app.post("/items/")
async def create_item(item: Item):
    return item
