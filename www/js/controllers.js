/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Login Page Controller //
  //////////////////////////
  loginPage: function(page) {
    
    // Login button click handler.
    page.querySelector('[component="button/login"]').onclick = function() {

      // Login using username and password.
      fn.modalShow();
      irisCli.userLogin(page.querySelector('#name-input').value, page.querySelector('#pass-input').value).then(function(user) {
   
        fn.pop({callback: function(e) {

          irisCli.setCurrentUser(user);
          window.localStorage.setItem("user", JSON.stringify(user));
          document.querySelector('#myNavigator').pushPage('html/profile.html');
          fn.modalHide();
        }});

      }, function (fail) {
        document.querySelector('#myNavigator').pushPage('html/login.html');
         fn.modalHide();
      //  ons.notification.alert('failed: ' + fail.message);
      });

    };

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function() {

      fn.push('html/register.html');

    };

  },

  //////////////////////////
  // Register Page Controller //
  //////////////////////////
  registerPage: function(page) {

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function() {

      // Submit request.
      fn.modalShow();
      irisCli.registerUser(
        page.querySelector('#name-input').value,
        page.querySelector('#pass-input').value,
        page.querySelector('#email-input').value
      ).then(function(e) {

        ons.notification.alert('Registration successful. Please login.');
        fn.pop({callback: function(e) {
          document.querySelector('#myNavigator').pushPage('html/login.html');
   
        }});

      }, function (fail) {
        ons.notification.alert('Failed: ' + fail.message);
      });

    }

  },

  //////////////////////////
  // Profile Page Controller //
  //////////////////////////
  profilePage: function(page) {

    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function () {
      document.querySelector('#menu').open();
    };
    if(irisCli.currentUser){
      irisCli.displayUser(irisCli.currentUser.userid).then(function(user){
        page.querySelector('#profile-name').innerHTML = user.response[0].name || "";
        page.querySelector('#profile-email').innerHTML = user.response[0].username || "";
      }, function(fail){
        ons.notification.alert('Failed: ' + fail.message);
      })
    }
    else{
      document.querySelector('#myNavigator').pushPage('html/login.html');
    }
    

  },
    //////////////////////////
  // Profile Edit Page Controller //
  //////////////////////////
  profileEditPage: function(page) {

    // Render the user form.
    myApp.services.user.update(irisCli.currentUser.userid, 'profile-field-list');


    // Save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function() {

      ons.notification.confirm(
        {
          title: 'Save changes?',
          message: 'Previous data will be overwritten.',
          buttonLabels: ['Discard', 'Save']
        }
      ).then(function(buttonIndex) {
        if (buttonIndex === 1) {

          // Save the user entity.
          myApp.services.user.save(irisCli.currentUser.userid, 'profile-field-list');

        }
      });

    }

  },

  //////////////////////////
  // Node View Page Controller //
  //////////////////////////
  contentViewPage: function(page) {

    irisCli.listPages().then(function(list) {

      console.log(list);
      // var listElement = document.getElementById('content-list'); //My ons-list element

      // for (var i = 0; i < results.length; i ++) {

      //   var node = new jDrupal.Node(results[i]);
      //   var newItemElement = document.createElement('ons-list-item'); //My new item
      //   newItemElement.innerText = node.getTitle(); //Text or HTML inside
      //   newItemElement.setAttribute('tappable', '');
      //   newItemElement.setAttribute('onclick', "fn.push('html/node.html', {data: {nid: " + node.id() + "}})");
      //   listElement.appendChild(newItemElement)

      // }
    });

  },

  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function(page) {

  }
};

window.fn = {};

// Show modal 'Loading'.
window.fn.modalShow = function() {
  document.getElementById('loadingModal').show();
}

// Hide modal 'Loading'.
window.fn.modalHide = function() {
  document.getElementById('loadingModal').hide();
}

// Open the menu.
window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

// pushPage extension to show/hide modals and close menu afterwards.
window.fn.push = function(page, options) {

  if (!options) {
    options = {};
  }
  var menu = document.getElementById('menu');

  window.fn.modalShow();
  options.callback = window.fn.modalHide();
  document.querySelector('#myNavigator').pushPage(page, options)
    .then(menu.close.bind(menu));

}

// popPage extension.
window.fn.pop = function(options) {
  var content = document.getElementById('myNavigator');
  if (!options) {
    options = {};
  }
  content.popPage(options);
};

