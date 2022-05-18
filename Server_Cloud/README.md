## changement depuis la dernière version
L'objectif est de simplifier la mise en route du server et de diminuer le nombre de fichier
service.py et server.js ont fusionné dans server_cloud.js
- on peut donc supprimer les fichiers suivants : 
    - server.js
    - service.py (attendre de vérifier que l'ensemnble des fonctionnalités ont été intégré dans server_cloud.js)

==> Always run server_cloud.js before server.box.js
List of npm install
- npm install nodemon
- npm install express
- npm install cors   
- npm i chart.js
- npm install socket.io
- npm install axios

To launch server_cloud

`nodemon server_cloud.js`
## Site Web
sur un navigateur accéder au service wifi et video via l'adress du cloud par : 
http://172.16.57.126:8000/ (pour JB)
ou
http://192.168.1.29:8000/  (pour David)
Attention le numéro de port à changer
## remarques générales
- npm install --save cors pour server_cloud.js
- Modify line10 of client.js by indicating ip local adress