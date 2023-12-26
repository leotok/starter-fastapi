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


def check_singed(guest, song, checked_time):
    songs = get_songs()
    checked_song = [s for s in songs["queue"] if s["guest"] == guest and s["song"] == song][0]
    songs["queue"] = [s for s in songs["queue"] if s["guest"] != guest and s["song"] != song]
    checked_song["checked_time"] = checked_time
    songs["singed"].append(checked_song)
    s3.put_object(
        Body=json.dumps(songs),
        Bucket="cyclic-ruby-confused-viper-sa-east-1",
        Key="songs_list.json"
    )

def save_song(guest, song, submitted_time):
    songs = get_songs()
    songs["queue"].append({"guest": guest, "song": song, "submitted_time": submitted_time})
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
    return {"queue": [], "singed": []}

def reset_songs():
    s3.put_object(
        Body=json.dumps({"queue": [], "singed": []}),
        Bucket="cyclic-ruby-confused-viper-sa-east-1",
        Key="songs_list.json"
    )

@app.get("/song/check")
async def check_sing_route(request: Request, guest: str, song: str, checked_time: str):
    check_singed(guest, song, checked_time)
    return {
        "msg": "Song checked",
        "payload": {
                "guest": guest,
                "song": song,
                "checked_time": checked_time,
        }
    }

@app.get("/song/reset")
async def reset_songs_route(request: Request):
    reset_songs()
    return {"msg": "Songs reset"}


@app.get("/song/save")
async def save_song_route(request: Request, guest: str, song: str, submitted_time: str):
    save_song(guest, song, submitted_time)
    return {
        "msg": "Saved",
        "payload": {
            "guest": guest,
            "song": song,
            "submitted_time": submitted_time,
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
