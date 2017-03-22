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
      irisCli.userLogin(page.querySelector('#name-input').value, page.querySelector('#pass-input').value).then(function(e) {
        fn.pop({callback: function(e) {

          //myApp.services.profileLoad(document.querySelector('#myNavigator').topPage);
          document.querySelector('#myNavigator').pushPage('html/profile.html');
          fn.modalHide();
        }});

      }, function (fail) {
        console.log(fail);
        document.querySelector('#myNavigator').pushPage('html/login.html');
         fn.modalHide();
      //  ons.notification.alert('failed: ' + fail.message);
      });

    };

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function() {

      fn.pop({callback : function(e) {
        // Load the register page.
        fn.push('html/register.html');
      }});

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
      jDrupal.userRegister(
        page.querySelector('#name-input').value,
        page.querySelector('#pass-input').value,
        page.querySelector('#email-input').value
      ).then(function(e) {

        ons.notification.alert('Registration successful. Please login.');
        fn.pop({callback: function(e) {
          myApp.services.profileLoad(document.querySelector('#myNavigator').topPage);
          fn.modalHide();
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

    // Load the profile fields.
    myApp.services.profileLoad(page);

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

