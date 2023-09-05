const socket_objects = io();
//const base_commands_url = "http://192.168.1.20:5000/commands"
const base_commands_url = "http://192.168.1.19:5000/commands"

/* Connected objects info section  */
connected_objects_info = document.getElementById('overlapped_objects');
setActionsButton = document.getElementById('button-set-actions');
dropdownButton1 = document.getElementById('dropdown-btn1');
actionsList1 = document.getElementById('actions-list1');
actionKey1Text = document.getElementById('actions-key1');
dropdownButton2 = document.getElementById('dropdown-btn2');
actionsList2 = document.getElementById('actions-list2');
actionKey2Text = document.getElementById('actions-key2');
dropdownButton3 = document.getElementById('dropdown-btn3');
actionsList3 = document.getElementById('actions-list3');
actionKey3Text = document.getElementById('actions-key3');
dropdownButton4 = document.getElementById('dropdown-btn4');
actionsList4 = document.getElementById('actions-list4');
actionKey4Text = document.getElementById('actions-key4');

/* Objects initial values */
actionsList1.style.display = 'none';
actionsList2.style.display = 'none';
actionsList3.style.display = 'none';
actionsList4.style.display = 'none';
actionKey1Text.style.display = "block";
actionKey2Text.style.display = "block";
actionKey3Text.style.display = "block";
actionKey4Text.style.display = "block";
connected_objects_info.style.visibility = "hidden";

// Connected objects status values
button1_batery_level = document.getElementById('button1-battery-level');
button1_last_ka = document.getElementById('button1-last-ka');
button2_batery_level = document.getElementById('button2-battery-level');
button2_last_ka = document.getElementById('button2-last-ka');
cam1_last_ka = document.getElementById('cam1-last-ka');


/* Set init values */
button1_batery_level.textContent = "n/a";
button1_last_ka.textContent = "----";
button2_batery_level.textContent = "n/a";
button2_last_ka.textContent = "---";
cam1_last_ka.textContent = "---";
actions_list = [];
action1 = {"id": -1, "name": ""};
action2 = {"id": -1, "name": ""};
action3 = {"id": -1, "name": ""};
action4 = {"id": -1, "name": ""};
retreived = false;

// Retrieve actions list and current configured actions periodically 
setInterval(retreive_actions_list, 5000);

// configure dropdowns
dropdownButton1.addEventListener('click', () => {
    actionsList1.style.display = actionsList1.style.display === 'block' ? 'none' : 'block';
    actionsList2.style.display = 'none';
    actionsList3.style.display = 'none';
    actionsList4.style.display = 'none';      
    dropdownButton2.style.visibility = actionsList1.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton3.style.visibility = actionsList1.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton4.style.visibility = actionsList1.style.display === 'block' ? 'hidden' : 'visible';
    setActionsButton.style.visibility = actionsList1.style.display === 'block' ? 'hidden' : 'visible';
    actionKey1Text.style.display = "block";
    actionKey2Text.style.display = actionsList1.style.display === 'block' ? 'none' : 'block';
    actionKey3Text.style.display = actionsList1.style.display === 'block' ? 'none' : 'block';
    actionKey4Text.style.display = actionsList1.style.display === 'block' ? 'none' : 'block';
});
dropdownButton2.addEventListener('click', () => {
    actionsList2.style.display = actionsList2.style.display === 'block' ? 'none' : 'block';
    actionsList1.style.display = 'none';
    actionsList3.style.display = 'none';
    actionsList4.style.display = 'none';
    dropdownButton1.style.visibility = actionsList2.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton3.style.visibility = actionsList2.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton4.style.visibility = actionsList2.style.display === 'block' ? 'hidden' : 'visible';
    setActionsButton.style.visibility = actionsList2.style.display === 'block' ? 'hidden' : 'visible';
    actionKey2Text.style.display = "block";
    actionKey1Text.style.display = actionsList2.style.display === 'block' ? 'none' : 'block';
    actionKey3Text.style.display = actionsList2.style.display === 'block' ? 'none' : 'block';
    actionKey4Text.style.display = actionsList2.style.display === 'block' ? 'none' : 'block';
});
dropdownButton3.addEventListener('click', () => {
    actionsList3.style.display = actionsList3.style.display === 'block' ? 'none' : 'block';
    actionsList1.style.display = 'none';
    actionsList2.style.display = 'none';
    actionsList4.style.display = 'none';
    dropdownButton1.style.visibility = actionsList3.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton2.style.visibility = actionsList3.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton4.style.visibility = actionsList3.style.display === 'block' ? 'hidden' : 'visible';
    setActionsButton.style.visibility = actionsList3.style.display === 'block' ? 'hidden' : 'visible';
    actionKey3Text.style.display = "block";
    actionKey1Text.style.display = actionsList3.style.display === 'block' ? 'none' : 'block';
    actionKey2Text.style.display = actionsList3.style.display === 'block' ? 'none' : 'block';
    actionKey4Text.style.display = actionsList3.style.display === 'block' ? 'none' : 'block';
});
dropdownButton4.addEventListener('click', () => {
    actionsList4.style.display = actionsList4.style.display === 'block' ? 'none' : 'block';
    actionsList1.style.display = 'none';
    actionsList2.style.display = 'none';
    actionsList3.style.display = 'none';    
    dropdownButton1.style.visibility = actionsList4.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton2.style.visibility = actionsList4.style.display === 'block' ? 'hidden' : 'visible';
    dropdownButton3.style.visibility = actionsList4.style.display === 'block' ? 'hidden' : 'visible';
    setActionsButton.style.visibility = actionsList4.style.display === 'block' ? 'hidden' : 'visible';
    actionKey4Text.style.display = "block";
    actionKey1Text.style.display = actionsList4.style.display === 'block' ? 'none' : 'block';
    actionKey2Text.style.display = actionsList4.style.display === 'block' ? 'none' : 'block';
    actionKey3Text.style.display = actionsList4.style.display === 'block' ? 'none' : 'block';
});

// Set actions button event
setActionsButton.addEventListener('click', function() {
    set_actions_list();
});
function fill_actions_dropdowns(){

    /* Dropdown 1 */
    actions_list.forEach(action => {      
        const actionText = action["name"];        
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = actionText;
        li.appendChild(a);
        actionsList1.appendChild(li);
            
        a.addEventListener('click', () => {
          console.log("For action 1 clicked option: " + actionText );
          dropdownButton1.textContent = actionText;
          actionsList1.style.display = 'none';
          dropdownButton1.style.visibility = 'visible';
          dropdownButton2.style.visibility = 'visible';
          dropdownButton3.style.visibility = 'visible';
          dropdownButton4.style.visibility = 'visible';
          setActionsButton.style.visibility = 'visible';
          actionKey1Text.style.display = "block";
          actionKey2Text.style.display = "block";
          actionKey3Text.style.display = "block";
          actionKey4Text.style.display = "block";
        
          // set Action 1
          action1 = get_action_from_name(actionText)
        });
    });

    /* Dropdown 2 */
    actions_list.forEach(action => {      
        const actionText = action["name"];        
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = actionText;
        li.appendChild(a);
        actionsList2.appendChild(li);
            
        a.addEventListener('click', () => {
          console.log("For action 2 clicked option: " + actionText );
          dropdownButton2.textContent = actionText;
          actionsList2.style.display = 'none';
          dropdownButton1.style.visibility = 'visible';
          dropdownButton2.style.visibility = 'visible';
          dropdownButton3.style.visibility = 'visible';
          dropdownButton4.style.visibility = 'visible';
          setActionsButton.style.visibility = 'visible';
          actionKey1Text.style.display = "block";
          actionKey2Text.style.display = "block";
          actionKey3Text.style.display = "block";
          actionKey4Text.style.display = "block";

          // set Action 2
          action2 = get_action_from_name(actionText)
        });
    });

    /* Dropdown 3 */
    actions_list.forEach(action => {      
        const actionText = action["name"];        
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = actionText;
        li.appendChild(a);
        actionsList3.appendChild(li);
            
        a.addEventListener('click', () => {
          console.log("For action 3 clicked option: " + actionText );
          dropdownButton3.textContent = actionText;
          actionsList3.style.display = 'none';
          dropdownButton1.style.visibility = 'visible';
          dropdownButton2.style.visibility = 'visible';
          dropdownButton3.style.visibility = 'visible';
          dropdownButton4.style.visibility = 'visible';
          setActionsButton.style.visibility = 'visible';
          actionKey1Text.style.display = "block";
          actionKey2Text.style.display = "block";
          actionKey3Text.style.display = "block";
          actionKey4Text.style.display = "block";

          // set Action 3
          action3 = get_action_from_name(actionText)
        });
    });

    /* Dropdown 4 */
    actions_list.forEach(action => {      
        const actionText = action["name"];        
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = actionText;
        li.appendChild(a);
        actionsList4.appendChild(li);
            
        a.addEventListener('click', () => {
          console.log("For action 4 clicked option: " + actionText );
          dropdownButton4.textContent = actionText;
          actionsList4.style.display = 'none';
          dropdownButton1.style.visibility = 'visible';
          dropdownButton2.style.visibility = 'visible';
          dropdownButton3.style.visibility = 'visible';
          dropdownButton4.style.visibility = 'visible';
          setActionsButton.style.visibility = 'visible';
          actionKey1Text.style.display = "block";
          actionKey2Text.style.display = "block";
          actionKey3Text.style.display = "block";
          actionKey4Text.style.display = "block";

          // set Action 4
          action4 = get_action_from_name(actionText)
        });
    });
}
function retreive_actions_list(){
    if(retreived==true){
        return;
    }
    console.log("Retreiving actions list");
    // construct the final URL with the query string
    const url = base_commands_url;
    console.log("url: "+ url);

    // send the request and wait for the response
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            const jsonObject = JSON.parse(xhr.responseText);
            actions_list = jsonObject["commands"];
            fill_actions_dropdowns();
            retreive_current_actions();
            retreived = true;

        } else {
            console.error("Error:", xhr.statusText);
            actions_list = [];
        }
        setting_use_situation = false;        
    };
    xhr.onerror = function() {
        console.error("Network error"); 
        actions_list = [];
    };
}

function retreive_current_actions(){
    console.log("Retreiving current actions");
    // construct the final URL with the query string
    const url = `${base_commands_url}/current`;
    console.log("url: "+ url);

    // send the request and wait for the response
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            const jsonObject = JSON.parse(xhr.responseText);
            current_actions_list = jsonObject["commands"];
            action1=current_actions_list[0];
            action2=current_actions_list[1];
            action3=current_actions_list[2];
            action4=current_actions_list[3];
            fill_actions_buttons();

        } else {
            console.error("Error:", xhr.statusText);
            actions_list = [];
        }
        setting_use_situation = false;        
    };
    xhr.onerror = function() {
        console.error("Network error"); 
        actions_list = [];
    };
}

function set_actions_list(){
    console.log("Setting actions list");
    console.log("Action1: "+ action1.name);
    console.log("Action2: "+ action2.name);
    console.log("Action3: "+ action3.name);
    console.log("Action4: "+ action4.name);

    if((action1.id == -1) || (action2.id == -1) || (action3.id == -1) || (action4.id == -1)){
        console.log("Action not selected");
        return
    }
    
    // query params 
    const params = {commands_ids: [action1.id, action2.id, action3.id, action4.id]};    
    // convert the object to a query string
    const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    // construct the final URL with the query string
    const url = `${base_commands_url}/current?${queryString}`;
    console.log("url: "+ url);

    // send the request and wait for the response
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(null);

    xhr.onload = function() {        
        const response_json = JSON.parse(xhr.responseText);
        console.log(response_json);
    };
    xhr.onerror = function() {
        console.error("Network error");
    };
}

function fill_actions_buttons(){
    dropdownButton1.textContent = action1.name;
    dropdownButton2.textContent = action2.name;
    dropdownButton3.textContent = action3.name;
    dropdownButton4.textContent = action4.name;
}
function get_action_from_name(actionName){ 

    actionToReturn = {"id": -1, "name": ""};
    actions_list.forEach(action => {      
        if(actionName == action["name"]){
            actionToReturn.id =action["id"]
            actionToReturn.name =action["name"]
        }    
    });
    return actionToReturn;
}
socket_objects.on("button_battery_level", (body) => { 
    let device = body.device;
    let batLevel = body.batLevel;
    if(batLevel != null){
        console.log("device:"+ device +"  batLevel:" + batLevel);
        if(device==1){
            console.log("Updatting for device 1")
            button1_batery_level.textContent = batLevel + " %";
        }
        if(device==2){
            console.log("Updatting for device 2")
            button2_batery_level.textContent = batLevel + " %";
        }
    }                  
});

socket_objects.on("thread_connected_nodes_keep_alive", (body) => { 
    console.log(body);       
    // Clean nodes
    button1_last_ka.textContent = "----";
    button2_last_ka.textContent = "----";
    cam1_last_ka.textContent = "---";
    // Set nodes last seen
    for (var node_id in body){
        console.log("node_id:" + node_id + "  node_last_seen:" + body[node_id]);
        if(node_id == "1"){
            button1_last_ka.textContent = body[node_id];
        }
        else if(node_id == "2"){
            button2_last_ka.textContent = body[node_id];
        }
        else if(node_id == "cam"){
            cam1_last_ka.textContent = body[node_id];
        }

    } 
    
});