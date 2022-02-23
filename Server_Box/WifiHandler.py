
# pip3 install socketio
# pip3 install aiohttp
# pip3 install python-socketio

from aiohttp import web
import socketio
import logging

sio = socketio.AsyncServer(cors_allowed_origins="*")
app = web.Application()
sio.attach(app)

async def index(request):
    """Serve the client-side application."""
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

@sio.event
def connect(sid, environ):
    print("***** connect ", sid)

@sio.event
def disconnect(sid):
    print('****** disconnect ', sid)

@sio.event
async def chat_message(sid, data):
    print("****** message ", data)
    # subprocess.call(["sudo", "service", ""])

@sio.on('*')
def catch_all(event, sid, data):
    print("****** event ", data)
    pass


app.router.add_static('/static', 'static')
app.router.add_get('/', index)


if __name__ == '__main__':
    format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")
    web.run_app(app)