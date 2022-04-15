

# pip3 install asyncssh

import asyncio, asyncssh, sys
import os
import logging, re

HOSTNAME='172.16.57.126' # adresse du serveur cloud
USERNAME='pi'
PASSWORD='greenhomelan'

BASE_IM_DIR = "/home/pi/Pictures"

## BEWARE .. for the first time connection, you'll have to log from shell
# $ ssh pi@192.168.1.27
#The authenticity of host '192.168.1.27 (192.168.1.27)' can't be established.
#ECDSA key fingerprint is SHA256:AL8vbtZAXfr8kOhks2ljPZy72PTQLW4ghrcPImDery8.
#Are you sure you want to continue connecting (yes/no)? yes
#Warning: Permanently added '192.168.1.27' (ECDSA) to the list of known hosts.

# async def run_client():
#     async with asyncssh.connect(HOSTNAME, username=USERNAME, password=PASSWORD) as conn:
#         result = await conn.run('ls Pictures/*.jpg', check=True)
#         list_files = result.stdout.split()
#         # print(result.stdout, end='')
#         # print (list_files)
#         for fil in list_files:
#             print ("Retrieving ", fil)
#             await asyncssh.scp((conn,fil), '.')
#             await conn.run('rm '+fil, check=True)

# try:
#     asyncio.get_event_loop().run_until_complete(run_client())
# except (OSError, asyncssh.Error) as exc:
#     sys.exit('SSH connection failed: ' + str(exc))


# Main loop
async def main():
    logging.info ("--==< START >==--")
    
    files = [f for f in os.listdir(BASE_IM_DIR) if re.match(r'.*\.jpg', f)]
    print (files)
    if len (files) != 0:
        async with asyncssh.connect(HOSTNAME, username=USERNAME, password=PASSWORD) as conn:    
            for fic in files:
                print (BASE_IM_DIR + '/' + fic)
                
                await asyncssh.scp(BASE_IM_DIR + '/' + fic, (conn,fic))      
    # await asyncssh.scp((conn,fil), '.')

if __name__=="__main__":
    format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

    asyncio.run(main())
    
    logging.info ("--==< END >==--")

