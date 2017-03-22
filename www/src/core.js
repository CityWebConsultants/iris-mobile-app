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

        console.log(req);
        req.onload = function() {
            if([200,201,202,204].indexOf(req.status) != -1){
                resolve(req.body);
            }
            else{
                reject(Error(req.statusText));
            }
        };

        req.onerror = function(e) { reject(Error("Network Error")); };
        req.send(JSON.stringify(options.content));
    });
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

irisCli.createUser = function(name, pass){

    var admin = irisCli.adminUser();

    var auth = irisCli.userLogin(admin.username,admin.password);

    auth.then(function(res){
        return irisCli.Invoke({
            'uri' : '/entity/create/user',
            'method' : 'POST',
            'headers' : [{
                'key' :'content-type',
                'value' : 'application/json'
            }],
            'content' : {
                username: name,
                password: pass,
                roles: ['authenticated'],
                credentials: res
            }      
        });
    },function(){
        console.log(e);
        return new Error("failed to create user");
    })

    
};


