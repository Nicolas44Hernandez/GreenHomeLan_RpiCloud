# 

import requests
import json
import urllib.parse
import subprocess
import uuid


MSERV_ADR   = {
    "e4:5f:01:0e:34:81" : "http://192.168.1.29:8000",
    "e4:5f:01:0e:31:ed" : "http://172.16.57.126:8000"}

def readMyIp():
    allMyIps = subprocess.Popen("hostname -I", shell=True, stdout=subprocess.PIPE).stdout.read().strip().decode("utf-8").split()
    return (allMyIps[0])

def retriveMacAdress():
    return ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) for ele in range(0,8*6,8)][::-1])
        
def declareMyIp ():
    result = False
    url = MSERV_ADR[retriveMacAdress()] + "/boxes_ip"
    payload={"name":"rpi_box", 'ip':readMyIp()}
    print(payload)
    print (url, payload)
    try:
        response = requests.request(
                "POST"
                , url, headers = {}
                , data=payload, files = []
                #, verify=False
                )
        if (response.status_code != 201):
            print (f"ERROR: Unable to publish my Ip {payload}.\n code = {response.status_code}")
            result = False
        print(f"Successfully published report {json.loads(response.text)}")

    except :
        print (f"ERROR: Unable to post migration report  {payload}")
        return False
    return result

if __name__ == '__main__':
    declareMyIp ()
