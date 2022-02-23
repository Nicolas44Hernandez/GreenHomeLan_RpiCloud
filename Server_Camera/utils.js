'use strict';

const get_str_date = function() {
    let currentdate = new Date(Date.now());
    let strDate = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + ("0" + currentdate.getHours()).slice(-2) + "h" + ("0" + currentdate.getMinutes()).slice(-2) + ":" + ("0" + currentdate.getSeconds()).slice(-2) + " " + ("0" + currentdate.getMilliseconds()).slice(-3);
    return strDate;
}

const log = function(msg, insert_line = false) {
    let strDate = "[" + get_str_date() + "] ";
    let newMsg = strDate + msg;
    if (insert_line) {
        newMsg = "\n" + newMsg;
    }
    console.log(newMsg);
}

function get_id() {
    return Math.random().toString(36).substring(2, 15);
}

//------------------------------    EXPORTS    ---------------------------------

exports.log = function(msg) {
    log(msg);
}

exports.get_id = function() {
    return get_id();
}
