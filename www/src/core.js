// Initialize the irisCli object.
var irisCli = {};

/**
 * Initializes the irisCli JSON object.
 */
irisCli.init = function() {
  // General properties.
  irisCli.csrf_token = false;
  irisCli.sessid = null;
  irisCli.modules = {};
  irisCli.connected = false; // Will be equal to true after the system connect.
  irisCli.settings = {
    sitePath: null
  };
  irisCli.currentUser = JSON.parse(window.localStorage.getItem("user"));

};

// Init jDrupal.
irisCli.init();


irisCli.sitePath = function() {
  return irisCli.settings.sitePath;
};

/**
 * Get or set a irisCli configuration setting.
 * @param {String} name
 * @returns {*}
 */


irisCli.config = function(name) {
  var value = typeof arguments[1] !== 'undefined' ? arguments[1] : null;
  if (value) {
    irisCli.settings[name] = value;
    return;
  }
  return irisCli.settings[name];
};


irisCli.Invoke = function(options) {

    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        if(options.credentials){
            if(options.uri.indexOf("?") > -1){
                options.uri+='&'
            }
            else{
                options.uri+='?'
            }
            options.uri+='credentials={"userid":' + irisCli.currentUser.userid + ',"token":"' + irisCli.currentUser.token + '"}';
        }
        req.open(options.method, irisCli.sitePath() + options.uri);
        if(options.headers){
            options.headers.forEach(function(header){
                req.setRequestHeader(header.key, header.value);
            })
        }


        req.onload = function() {
            if([200,201,202,204].indexOf(req.status) != -1){
                if(['[','{'].indexOf(req.response[0]) > -1){
                    resolve(JSON.parse(req.response));
                }
                else{
                    resolve(req.response);
                }
            }
            else{
                reject(Error(req.statusText));
            }
        };

        req.onerror = function(e) { reject(Error("Network Error")); };
        req.send(JSON.stringify(options.content));
    });
};


irisCli.setCurrentUser = function(user){
    irisCli.currentUser = user;
};

irisCli.userLogin = function(name, pass){
    return irisCli.Invoke({
        'uri' : '/api/login',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
        }],
        'content' : {
            username: name,
            password: pass
        }
    });
};

irisCli.registerUser = function(name, pass, username){

    return irisCli.Invoke({
        'uri' : '/entity/create/user',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : {
            username: name,
            password: pass
        }
    });

};


irisCli.editUser = function(eid, user){

    return irisCli.Invoke({
        'uri' : '/entity/edit/user/' + eid,
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : user,
        'credentials' : true
    });

};


irisCli.displayUser = function(eid){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["user"]&queries=[{"field":"eid","operator":"is","value":' + eid + '}]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'credentials' : true
    });

};

irisCli.listUsers = function(eids){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["user"]&queries=[{"field":"eid","operator":"in","value":[' + eids + ']}]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'credentials' : true
    });

};

irisCli.createPage = function(page){

    return irisCli.Invoke({
        'uri' : '/entity/create/page?',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : page,
        'credentials' : true
    });

};

irisCli.editPage = function(eid, page){

    return irisCli.Invoke({
        'uri' : '/entity/edit/page/' + eid + '?',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : page,
        'credentials' : true
    });

};

irisCli.displayPage = function(eid){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["page"]&queries=[{"field":"eid","operator":"is","value":' + eid + '}]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'credentials' : true
    });

};

irisCli.listPages = function(){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["page"]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'credentials' : true
    });

};

irisCli.createGroup = function(group){
    return irisCli.Invoke({
        'uri' : '/entity/create/group?',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : group,
        'credentials' : true
    });

};

irisCli.editGroup = function(eid, group){

    return irisCli.Invoke({
        'uri' : '/entity/edit/group/' + eid,
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : group,
        'credentials' : true
    });

};

irisCli.displayGroup = function(eid){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["group"]&queries=[{"field":"eid","operator":"is","value":' + eid + '}]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'credentials' : true
    });

};

irisCli.listGroup = function(){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["group"]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'credentials' : true
    });

};

irisCli.userLogout = function(){

    irisCli.setCurrentUser(null);
    window.localStorage.setItem("user", null);
    irisCli.Invoke({
        'uri' : '/logout',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
        }]
    }).then(function(user){
        ons.notification.alert('Successfully logged out.');
        document.querySelector('#myNavigator').resetToPage('html/profile.html')
            .then(menu.close.bind(menu));
    },function(fail){
        ons.notification.alert('Successfully logged out.');
        document.querySelector('#myNavigator').resetToPage('html/profile.html')
            .then(menu.close.bind(menu));
    });


};

irisCli.checkToken = function (user) {

  var token = JSON.parse(window.localStorage.getItem("token"));

  if (typeof user.firebase_token == 'undefined' || user.firebase_token == null) {

    if (typeof token.token != 'undefined') {

      user.firebase_token = token.token;

      irisCli.displayUser(user.userid).then(function (pass) {

        var userResponse = pass.response[0];
        delete userResponse.password;
        userResponse.firebase_token = token.token;

        irisCli.editUser(user.userid, userResponse).then(function (saved) {

          ons.notification.alert('saved: ' + JSON.stringify(saved));

        }, function (fail) {

          ons.notification.alert('failed: ' + JSON.stringify(fail));

        });

      });

    }
    else if (token.token != user.firebase_token) {

      user.firebase_token = token.token;
      irisCli.editUser(user.eid, user);

    }

  }

}

irisCli.updateToken = function (token) {

  var update = {
    token: token,
    timestamp: new Date()
  }

  window.localStorage.setItem("token", JSON.stringify(update));

}

// device APIs are available

irisCli.onDeviceReady = function () {

  window.FirebasePlugin.getToken(function (token) {

    // save this server-side and use it to push notifications to this device
    if (!token) {
      token = Math.floor(Math.random() * 20);
    }
    irisCli.updateToken(token);

  }, function (error) {

    ons.notification.alert('error" ' + error);

  });

  window.FirebasePlugin.onTokenRefresh(function (token) {
    // save this server-side and use it to push notifications to this device
    if (!token) {
      token = Math.floor(Math.random() * 20);
    }
    irisCli.updateToken(token);

  }, function (error) {

    ons.notification.alert('error2 ' + error);

  });

  window.FirebasePlugin.onNotificationOpen(function (notification) {

    ons.notification.alert('notif: ' + JSON.stringify(notification));

  }, function (error) {

    ons.notification.alert('error3: ' + error);

  });

}


