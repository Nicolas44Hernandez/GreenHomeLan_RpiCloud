
# pip install flask flask_restful
# pip install waitress
# pip install pyopenssl

from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import json 
import os
from datetime import datetime
import time
from waitress import serve

app = Flask(__name__)
api = Api(app)

BOXES_IP = {
    'box_name': 'box_ip',
}
STORAGE_FILE = 'boxesip.json'

def abort_if_migration_doesnt_exist(box_name):
    if box_name not in BOXES_IP:
        abort(404, message="Box {} doesn't exist".format(box_name))

parser = reqparse.RequestParser()
parser.add_argument('name')
parser.add_argument('ip')


# Migration
# shows a single migration item and lets you delete a migration item
class BoxIp(Resource):
    def get(self, box_name):
        abort_if_migration_doesnt_exist(box_name)
        return BOXES_IP[box_name]

    def delete(self, box_name):
        abort_if_migration_doesnt_exist(box_name)
        del BOXES_IP[box_name]
        with open(STORAGE_FILE, 'w') as f: f.write(json.dumps(BOXES_IP))
        return '', 204

    def put(self, box_name):
        args = parser.parse_args()
        theBox = BOXES_IP[box_name]
        task = {
            'migration_id' : theBox['migration_id'],
            'date': theBox['date'],
            'timestamp':theBox['timestamp'], 
            'ip': args['ip'], 'clientID': args['clientId'], 'serial': args['serial'], 
            'BUname' : args['BUname'], 'apn': args['apn'],
            'result':args['result']
        }
        BOXES_IP[migration_id] = task
        with open(STORAGE_FILE, 'w') as f: f.write(json.dumps(BOXES_IP))
        return task, 201


# MigrationList
# shows a list of all BOXES_IP, and lets you POST to add new tasks
class BoxesList(Resource):
    def get(self):
        return BOXES_IP

    def post(self):
        args = parser.parse_args()
        # migration_id = int(max(BOXES_IP.keys()).lstrip('migration_')) + 1
        print (f"Args are {args}")
        # txt_migration_id = 'migration_%05d' % migration_id
        # datim = datetime.today().strftime('%Y-%m-%d-%H:%M:%S')
        # timestamp = round(time.time() * 1000)
        BOXES_IP[args['name']] = args['ip']
        print (f"records are {BOXES_IP}")
        # "ip":FTP_SERVER, "clientId": THING_NAME, "serial": SERIAL_NUMBER, "result":migration_result
        
        with open(STORAGE_FILE, 'w') as f: f.write(json.dumps(BOXES_IP))
        return BOXES_IP[args['name']], 201

##
## Actually setup the Api resource routing here
##
api.add_resource(BoxesList, '/boxes_ip')
api.add_resource(BoxIp, '/boxes_ip/<box_name>')

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

if __name__ == '__main__':
    if (os.path.isfile(STORAGE_FILE) ):
        BOXES_IP = json.loads(open(STORAGE_FILE, 'r').read())
        
    #app.run(debug=False, host ='0.0.0.0', port=443, ssl_context=('cert.pem', 'key.pem'))

    serve(app, host='0.0.0.0', port=8000)