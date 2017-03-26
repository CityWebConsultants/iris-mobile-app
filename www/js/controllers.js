/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Login Page Controller //
  //////////////////////////
  loginPage: function (page) {

    // Login button click handler.
    page.querySelector('[component="button/login"]').onclick = function () {

      // Login using username and password.
      fn.modalShow();
      irisCli.userLogin(page.querySelector('#name-input').value, page.querySelector('#pass-input').value).then(function (user) {

        fn.pop({
          callback: function (e) {

            irisCli.setCurrentUser(user);
            window.localStorage.setItem("user", JSON.stringify(user));
            irisCli.checkToken(user);

            document.querySelector('#myNavigator').pushPage('html/profile.html');
            fn.modalHide();
          }
        });

      }, function (fail) {
        document.querySelector('#myNavigator').pushPage('html/login.html');
        ons.notification.alert('Error logging in: ' + JSON.stringify(fail));
        fn.modalHide();
        //  ons.notification.alert('failed: ' + fail.message);
      });

    };

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function () {

      fn.push('html/register.html');

    };

  },

  //////////////////////////
  // Register Page Controller //
  //////////////////////////
  registerPage: function (page) {

    // Register button click handler.
    page.querySelector('[component="button/register"]').onclick = function () {

      // Submit request.
      fn.modalShow();
      irisCli.registerUser(
        page.querySelector('#name-input').value,
        page.querySelector('#pass-input').value,
        page.querySelector('#email-input').value
      ).then(function (e) {

        ons.notification.alert('Registration successful. Please login.');
        fn.pop({
          callback: function (e) {
            document.querySelector('#myNavigator').pushPage('html/login.html');
            fn.modalShow();
          }
        });

      }, function (fail) {
        ons.notification.alert('Failed: ' + fail.message);
        fn.modalShow();
      });

    }

  },

  //////////////////////////
  // Profile Page Controller //
  //////////////////////////
  profilePage: function (page) {

    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = function () {
      document.querySelector('#menu').open();
    };

    if (irisCli.currentUser) {

      irisCli.displayUser(irisCli.currentUser.userid).then(function (user) {

        page.querySelector('#profile-name').innerHTML = user.response[0].name || "";
        page.querySelector('#profile-email').innerHTML = user.response[0].username || "";
        irisCli.checkToken(user.response[0]);

      }, function (fail) {
        ons.notification.alert('Failed: ' + fail.message);
      });

    }
    else {
      document.querySelector('#myNavigator').pushPage('html/login.html');
    }

  },
  //////////////////////////
  // Profile Edit Page Controller //
  //////////////////////////
  profileEditPage: function (page) {

    // Render the user form.
    myApp.services.user.update(irisCli.currentUser.userid, 'profile-field-list');


    // Save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function () {

      ons.notification.confirm(
        {
          title: 'Save changes?',
          message: 'Previous data will be overwritten.',
          buttonLabels: ['Discard', 'Save']
        }
      ).then(function (buttonIndex) {
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
  contentViewPage: function (page) {

    irisCli.listPages().then(function (response) {
      var list = response.response;
      var listElement = document.getElementById('content-list'); //My ons-list element

      for (var i = 0; i < list.length; i++) {

        var newItemElement = document.createElement('ons-list-item'); //My new item
        newItemElement.innerText = list[i].title; //Text or HTML inside
        newItemElement.setAttribute('tappable', '');
        newItemElement.setAttribute('onclick', "fn.push('html/node.html', {data: {nid: " + list[i].eid + "}})");
        listElement.appendChild(newItemElement);

      }
    });

  },

  //////////////////////////
  // Node View Page Controller //
  //////////////////////////
  nodePage: function (page) {

    // Click handler for Edit button
    page.querySelector('[component="button/edit-node"]').onclick = function () {
      fn.push('html/node_edit.html', {data: {nid: document.querySelector('#myNavigator').topPage.data.nid}});
    };

    // Refresh the previous page on clicking back incase node was updated.
    document.querySelector('#nodePage ons-back-button').options = {refresh: true}

    // Load node and append to list.
    myApp.services.node.load(document.querySelector('#myNavigator').topPage.data.nid, 'field-list');

  },
  //////////////////////////
  // Node Create Page Controller //
  //////////////////////////
  nodeCreatePage: function (page) {

    // Save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function () {

      myApp.services.node.save(null, 'edit-field-list');

    };

  },
  //////////////////////////
  // Node Edit Page Controller //
  //////////////////////////
  nodeEditPage: function (page) {

    // Populate the node edit form.
    myApp.services.node.update(document.querySelector('#myNavigator').topPage.data.nid, 'edit-field-list');

    // Node save button click event.
    page.querySelector('[component="button/save-node"]').onclick = function () {

      ons.notification.confirm(
        {
          title: 'Save changes?',
          message: 'Previous data will be overwritten.',
          buttonLabels: ['Discard', 'Save']
        }
      ).then(function (buttonIndex) {
        if (buttonIndex === 1) {

          myApp.services.node.save(document.querySelector('#myNavigator').topPage.data.nid, 'edit-field-list');

        }
      });

    }

  },
  //////////////////////////
  // Group View Page Controller //
  //////////////////////////
  groupPage: function (page) {

    // Click handler for Edit button
    page.querySelector('[component="button/edit-group"]').onclick = function () {
      fn.push('html/group_edit.html', {data: {id: document.querySelector('#myNavigator').topPage.data.id}});
    };

    // Click handler for Edit button
    page.querySelector('[component="button/join-group"]').onclick = function () {
      ons.notification.confirm(
        {
          title: 'Please confirm!',
          message: 'Are you sure you wanna join this group?',
          buttonLabels: ['No', 'Yes']
        }
      ).then(function (buttonIndex) {
        if (buttonIndex === 1) {

          myApp.services.group.join(document.querySelector('#myNavigator').topPage.data.id);

        }
      });
    };
    // Click handler for Edit button
    page.querySelector('[component="button/leave-group"]').onclick = function () {
      ons.notification.confirm(
        {
          title: 'Please confirm!',
          message: 'Are you sure you wanna leave this group?',
          buttonLabels: ['No', 'Yes']
        }
      ).then(function (buttonIndex) {
        if (buttonIndex === 1) {

          myApp.services.group.leave(document.querySelector('#myNavigator').topPage.data.id);

        }
      });
    };

    // Refresh the previous page on clicking back incase node was updated.
    document.querySelector('#groupPage ons-back-button').options = {refresh: true}

    // Load node and append to list.
    myApp.services.group.load(document.querySelector('#myNavigator').topPage.data.id, 'field-list');

  },

  ////////////////////////
  // Group Page Controller //
  ////////////////////////
  groupViewPage: function (page) {

    // Load the 'Frontpage' view which has had the 'Rest export' display added.
    irisCli.listGroup().then(function (response) {
      var list = response.response;

      var listElement = document.getElementById('group-list'); //My ons-list element

      for (var i = 0; i < list.length; i++) {

        var newItemElement = document.createElement('ons-list-item'); //My new item
        console.log(list[i], list[i].eid);
        newItemElement.innerText = list[i].name; //Text or HTML inside
        newItemElement.setAttribute('tappable', '');
        newItemElement.setAttribute('onclick', "fn.push('html/group.html', {data: {id: " + list[i].eid + "}})");
        listElement.appendChild(newItemElement);

      }
    });

  },
  // //////////////////////////
  // Group Edit Page Controller //
  //////////////////////////
  groupEditPage: function (page) {

    // Populate the node edit form.
    myApp.services.group.update(document.querySelector('#myNavigator').topPage.data.id, 'edit-field-list');

    // Node save button click event.
    page.querySelector('[component="button/save-group"]').onclick = function () {

      ons.notification.confirm(
        {
          title: 'Save changes?',
          message: 'Previous data will be overwritten.',
          buttonLabels: ['Discard', 'Save']
        }
      ).then(function (buttonIndex) {
        if (buttonIndex === 1) {

          myApp.services.group.save(document.querySelector('#myNavigator').topPage.data.id, 'edit-field-list');

        }
      });

    }

  },
  ////////////////////////
  // Menu Page Controller //
  ////////////////////////
  menuPage: function (page) {

  }
};

window.fn = {};

// Show modal 'Loading'.
window.fn.modalShow = function () {
  document.getElementById('loadingModal').show();
}

// Hide modal 'Loading'.
window.fn.modalHide = function () {
  document.getElementById('loadingModal').hide();
}

// Open the menu.
window.fn.open = function () {
  var menu = document.getElementById('menu');
  menu.open();
};

// pushPage extension to show/hide modals and close menu afterwards.
window.fn.push = function (page, options) {

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
window.fn.pop = function (options) {
  var content = document.getElementById('myNavigator');
  if (!options) {
    options = {};
  }
  content.popPage(options);
};

