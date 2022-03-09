import pexpect
import time
import logging
import asyncio
import shlex, subprocess
import pexpect.popen_spawn
# import local
import uuid

DEBUG = True


if DEBUG: import sys

SCAN_WAIT_DURATION = 300

# adresse MAC BLE du 
BLE_MAC_ADR   = {
    "e4:5f:01:0e:34:81" : "",
    "e4:5f:01:0e:32:c2" : "24:0A:C4:C4:F5:26"}

def retriveMacAdress():
    return ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) for ele in range(0,8*6,8)][::-1])
  
blemacadr = BLE_MAC_ADR[retriveMacAdress()]
print (blemacadr)

async def bleMaintainLink(name, tab_event):
    logging.info (f"{name}--==< START >==--")
    [BleLinkEstablished] = tab_event
    time.sleep(15)
    #child = pexpect.spawn(f'sudo bluetoothctl', encoding='utf-8')
    child = pexpect.popen_spawn.PopenSpawn(f'sudo bluetoothctl', encoding='utf-8')
    if DEBUG: child.logfile_read = sys.stdout # foutread

    child.sendline("scan on")
    while(True):
        # idx = child.expect([f'Device {blemacadr} ServiceData Value:', pexpect.TIMEOUT], timeout=SCAN_WAIT_DURATION)
        idx = child.expect([f'Device {blemacadr} ServiceData ', pexpect.TIMEOUT], timeout=SCAN_WAIT_DURATION)
        if idx == 0 : 
            #process = subprocess.run(shlex.split(f'sudo ifdown wlan0'))
            logging.info (f"{name} starting wifi")
            subprocess.call(["rfkill", "unblock", "wifi"])
            time.sleep(1)
            # logging.info (f"{name} launching server")
            # subprocess.call(["node", local.JSERVER_PATH, "&"])
            #subprocess.call(["sudo", "ps", "-a"])
            #print('Trouvé ' + str(idx))
        else:
            print('No detection BLE command = ',str(idx), ' (if 0 then rpi detect the ble command')
        

async def main():
    BleLinkEstablished = asyncio.Event()
    BLELink = asyncio.create_task(bleMaintainLink("BleLinkMaintainer", [BleLinkEstablished] ))
    

if __name__ == '__main__':
    format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
