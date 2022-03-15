## Configuration
Modify line10 of client.js by indicating ip local adress

## Micro Service
python3 service.py

GET /boxes_ip/<box_name>

"172.16.57.129"

POST /boxes_ip
{"name":"box_name", 'ip':'box_ip'}

## Serveur Web
lancer : node server.js
remarque importante : python3 server.py est maintenant obsolète et remplacé par server.js

## Site Web
sur un navigateur accéder au service wifi et video via l'adress du cloud par : 
http://172.16.57.126:8080/ (pour JB)
ou
http://192.168.1.29:8080/  (pour David)



