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
    sitePath: null,
    adminUser: null

  };
  irisCli.currentUser = JSON.parse(window.localStorage.getItem("user"));

};

// Init jDrupal.
irisCli.init();


irisCli.sitePath = function() {
  return irisCli.settings.sitePath;
};

irisCli.adminUser = function() {
  return irisCli.settings.adminUser;
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
        'content' : user     
    });
    
};


irisCli.displayUser = function(eid){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["user"]&queries=[{"field":"eid","operator":"is","value":' + eid + '}]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }]   
    });
    
};

irisCli.createPage = function(page){
    console.log(page);
    return irisCli.Invoke({
        'uri' : '/entity/create/page?credentials={"userid":' + irisCli.currentUser.userid + ',"token":"' + irisCli.currentUser.token + '"}',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : page    
    });
    
};

irisCli.editPage = function(eid, page){

    return irisCli.Invoke({
        'uri' : '/entity/edit/page/' + eid + '?credentials={"userid":' + irisCli.currentUser.userid + ',"token":"' + irisCli.currentUser.token + '"}',
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : page     
    });
    
};

irisCli.displayPage = function(eid){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["page"]&queries=[{"field":"eid","operator":"is","value":' + eid + '}]&credentials={"userid":' + irisCli.currentUser.userid + ',"token":"' + irisCli.currentUser.token + '"}',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }]   
    });
    
};

irisCli.listPages = function(){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["page"]&credentials={"userid":' + irisCli.currentUser.userid + ',"token":"' + irisCli.currentUser.token + '"}',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }]   
    });
    
};

irisCli.joinGroup = function(eid, user){

    return irisCli.Invoke({
        'uri' : '/entity/edit/group/' + eid,
        'method' : 'POST',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }],
        'content' : {
            members: title,
            body: body
        }      
    });
    
};

irisCli.displayGroup = function(eid){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["page"]&queries=[{"field":"eid","operator":"is","value":' + eid + '}]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }]   
    });
    
};

irisCli.listMembers = function(){

    return irisCli.Invoke({
        'uri' : '/fetch?entities=["page"]',
        'method' : 'GET',
        'headers' : [{
            'key' :'content-type',
            'value' : 'application/json'
         }]   
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


