
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
import subprocess
import re
import logging
import threading

# Thread to monitor Thread
pinger = None

class pingMonitor (threading.Thread):
    NB_MAX_DEFECT = 5
    def __init__(self, threadID, name, delay, defectHanlder):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.delay = delay
        self.counter = self.NB_MAX_DEFECT
        self.defectHanlder = defectHanlder
        self.running = True
        self.monitor = False
    def startMonitor(self):
        self.monitor = True
        self.counter = self.NB_MAX_DEFECT
    def stopMonitor(self):
        self.monitor = False
    def pingReceived(self):
        logging.info("ping received by thread")
        self.counter = self.NB_MAX_DEFECT
    def stop(self):
        self.running = False
    def run(self):
        logging.info("Starting " + self.name)
        while (self.running):
            if self.monitor : 
                if (self.counter != self.NB_MAX_DEFECT):
                    logging.info(f"WARNING {self.NB_MAX_DEFECT-self.counter} missed ping. {self.counter} more before table reset.")
                self.counter -= 1
                if (self.counter == 0)  :
                    self.defectHanlder()
                    self.stopMonitor()
            time.sleep(self.delay)
        logging.info("Exiting " + self.name)


app = Flask(__name__)
api = Api(app)

def getArpConnected():

    connected = subprocess.Popen(
        "iw dev wlan0 station dump | grep Station",
        shell=True, 
        stdout=subprocess.PIPE
    ).stdout.read().decode("utf-8").split ('\n')

    list_mac_connected = []
    for li in connected:

        z = re.match ("Station\s*([0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2})",li)
        if z:
            list_mac_connected.append(z.groups[1])

    print (list_mac_connected)
    
    connected = subprocess.Popen(
        "awk '$4~/[1-9a-f]+/&&$6~/^wl/{print $1\" \"$4}' /proc/net/arp", 
        shell=True, 
        stdout=subprocess.PIPE
    ).stdout.read().decode("utf-8").split ('\n')
    list_arp_connected = []
    for eqt in connected:
        if (eqt.strip() != ""):
            fields = eqt.split()
            list_arp_connected.append (
                {
                    "mac" : fields[1],
                    "ip" : fields[0]
                }
            )
    return (list_arp_connected)


def getIpTablesNatPreroutingRules():
    iptablesNat = subprocess.Popen(
        "sudo iptables -L -t nat --line-numbers", 
        shell=True, 
        stdout=subprocess.PIPE
    ).stdout.read().decode("utf-8")
    state = 0
    rules = []
    for li in iptablesNat.split ('\n'):
        if (li.strip().startswith('Chain')):
            chain_type = li.split(' ')[1].strip()
            if (chain_type == "PREROUTING"):
                state = 1
            elif (chain_type == "INPUT"):
                state = 2
            elif (chain_type == "OUTPUT"):
                state = 3
            elif (chain_type == "POSTROUTING"):
                state = 4
            else:
                state = 5
                pass
        elif (li.strip().startswith('num')):
            pass
        else:
            if state == 1:
                z = re.match ("([0-9]+)\s*([A-Z]+)\s*([a-z]+)\s+([^\s]+)\s*([^\s]+)\s*([^\s]+)\s*([^\s]*)",li)
                if z:
                    grps = z.groups()
                    # print (grps[0], grps[1], grps[2], grps[3] )
                    rules.append (
                        {
                            "num" : grps[0],
                            "target" : grps[1],
                            "prot" : grps[2],
                            "opt" : grps[3],
                            "source"  : grps[4],
                            "destination" : grps[5],
                        }
                    )
    return rules


def deleteIpTablePreroutingRule(ruleNumber):
    # sudo iptables -t nat -D PREROUTING 1
    cmd = ["sudo", "iptables", "-t", "nat", "-D", "PREROUTING", str(ruleNumber)]
    print (cmd)
    subprocess.call(cmd)


# sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 4000 -m conntrack --ctstate NEW -j DNAT --to 192.168.4.12:4000

# sudo iptables -t nat -A PREROUTING -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

def createNatPreroutingRules(targetIp):
    cmd = ["sudo", "iptables", "-t", "nat", "-A", "PREROUTING", 
            "-i", "eth0", "-p", "tcp", "--dport", "4000", "-m", "conntrack", "--ctstate", "NEW", "-j", "DNAT", "--to", f"{targetIp}:4000"]
    print (cmd)            
    subprocess.call(cmd)

    cmd = ["sudo", "iptables", "-t", "nat", "-A", "PREROUTING", 
        "-m", "conntrack", "--ctstate", "ESTABLISHED,RELATED", "-j", "ACCEPT"]
    print (cmd)            
    subprocess.call(cmd)


parser = reqparse.RequestParser()
parser.add_argument('command')
parser.add_argument('ip')



def removeRules():
    logging.info("Deleting routing rules from iptables")
    del_count = 0
    for rul in getIpTablesNatPreroutingRules():
        logging.info(f"deleting {rul['num']}")
        deleteIpTablePreroutingRule(int(rul["num"]) - del_count)
        del_count+= 1

def createRules():
    connecteds = getArpConnected()
    nbRetry = 10
    while (len (connecteds) == 0) and (nbRetry > 0):
        logging.info(f"attempt {nbRetry}")
        connecteds = getArpConnected()
        nbRetry -=1
        time.sleep(1)
    print (connecteds)
    if (len (connecteds) != 0):
        logging.info(f"routing http traffic to {connecteds[0] ['ip']}")
        createNatPreroutingRules(connecteds[0] ['ip'])
    else:
        logging.info("unable to create routing rules")


# MigrationList
# shows a list of all BOXES_IP, and lets you POST to add new tasks
class Wifi(Resource):
    def get(self):
        if (os.path.isfile("/run/hostapd.pid") ):
            return '{"etat":"active"}'
        else:
            return '{"etat":"inactive"}'

    def post(self):
        args = parser.parse_args()
        # migration_id = int(max(BOXES_IP.keys()).lstrip('migration_')) + 1
        logging.info(f"Args are {args}")
        command = args['command']
        logging.info(f"command is {command}")
        # txt_migration_id = 'migration_%05d' % migration_id
        # datim = datetime.today().strftime('%Y-%m-%d-%H:%M:%S')
        # timestamp = round(time.time() * 1000)
        # "ip":FTP_SERVER, "clientId": THING_NAME, "serial": SERIAL_NUMBER, "result":migration_result
        if (command == "activate"):
            removeRules()
            subprocess.call(["sudo", "service", "hostapd", "start"])

        elif (command == "desactivate"):
            subprocess.call(["sudo", "service", "hostapd", "stop"])
            removeRules()
        else:
            logging.error(f"Unknown command : {command}")

        # with open(STORAGE_FILE, 'w') as f: f.write(json.dumps(BOXES_IP))
        return self.get(), 201

class Ping(Resource):
    def post(self):
        global pinger
        logging.info("ping received")
        pinger.pingReceived()
        return '{"ping":"pong"}', 201


class Leases(Resource):
    def get(self):
        return getArpConnected()
    def post(self):
        args = parser.parse_args()
        logging.info(f"Args are {args}")
        command = args['command']
        lease_ip = args['ip']
        if (command == "route"):
            logging.info(f"ip of lease is {lease_ip}")
            pinger.startMonitor()
            createNatPreroutingRules(lease_ip)
            return '{"status":"routed", "ip":"{lease_ip}"}', 201
        else:
            logging.info(f"removing route")
            pinger.stopMonitor()
            removeRules()
            return '{"status":"unrouted"}', 201

##
## Actually setup the Api resource routing here
##
api.add_resource(Wifi, '/wifi')
api.add_resource(Leases, "/leases")
api.add_resource(Ping, "/ping")

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
  return response



if __name__ == '__main__':

    logging.basicConfig(format="%(asctime)s: %(message)s", level=logging.INFO, datefmt="%H:%M:%S")

    logging.info("starting threads")
    pinger = pingMonitor(1, "Pinger", 5, removeRules)
    pinger.start()

    logging.info("starting app ")
    app.run(debug=True, host ='0.0.0.0', port=8008)
