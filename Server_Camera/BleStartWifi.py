import pexpect
import time
import logging
import asyncio
import shlex, subprocess
import pexpect.popen_spawn
import local


SCAN_WAIT_DURATION = 300

async def bleMaintainLink(name, tab_event):
    logging.info (f"{name}--==< START >==--")
    [BleLinkEstablished] = tab_event
    time.sleep(15)
    #child = pexpect.spawn(f'sudo bluetoothctl', encoding='utf-8')
    child = pexpect.popen_spawn.PopenSpawn(f'sudo bluetoothctl', encoding='utf-8')
    child.sendline("scan on")
    while(True):
        idx = child.expect([f'Device {local.MAC_ADR} ServiceData Value:', pexpect.TIMEOUT], timeout=SCAN_WAIT_DURATION)
        print('No detection BLE command = ',str(idx), ' (if 0 then rpi detect the ble command')
        if idx == 0 : 
            #process = subprocess.run(shlex.split(f'sudo ifdown wlan0'))
            logging.info (f"{name} stating wifi")
            subprocess.call(["rfkill", "unblock", "wifi"])
            time.sleep(1)
            logging.info (f"{name} launching server")
            subprocess.call(["node", local.JSERVER_PATH, "&"])
            #subprocess.call(["sudo", "ps", "-a"])
            #print('Trouvé ' + str(idx))
        

async def main():
    BleLinkEstablished = asyncio.Event()
    BLELink = asyncio.create_task(bleMaintainLink("BleLinkMaintainer", [BleLinkEstablished] ))
    

if __name__ == '__main__':
    format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
