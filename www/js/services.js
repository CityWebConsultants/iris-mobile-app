/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  // Based on whether user is authenticated or not, display profile fields or redirect to login page.
  profileLoad: function(page){

    document.querySelector('#myNavigator').pushPage('html/login.html');

  },

  user : {

    update : function(eid, list){
      irisCli.displayUser(eid).then(function(user) {

        // Exclude from the form
        var excludeList = ['uid', 'uuid', 'changed'];

        // List to add elements to.
        var listElement = document.getElementById(list); //My ons-list element

        for (var key in user.response) {
          // skip loop if the property is from prototype
          if (!user.response.hasOwnProperty(key) || excludeList.indexOf(key) > -1) continue;

          var obj = user.response[key];

          for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;

            if (typeof obj[prop] != 'undefined') {

              // TODO: Need to account for multi-value fields.
              var newItemElement = document.createElement('ons-list-item'); //My new item

              newItemElement.setAttribute('modifier', 'nodivider');
              var elementHTML = '';

              // Use toggles for boolean fields
              if (typeof obj[prop] == 'boolean') {

                var checked = null;
                if (obj[prop] === true) {
                  var checked = 'checked';
                }

                elementHTML += '<label class="center" for="inner-highlight-input">' + prop + '</label>' +
                  '<label class="right">' +
                  '<ons-switch id="' + prop +'-input" data-key="' + prop + '" ' + checked + ' input-id="inner-highlight-input"></ons-switch>' +
                  '</label>';

              }
              else {
                // Else use textfields.
                elementHTML +=
                  '<ons-if platform="ios other" class="left left-label">' + prop + '</ons-if>' +
                  '<div class="center">' +
                  '<ons-input input-id="' + prop + '-input" type="text" value="' + obj[prop] + '" data-key="' + prop + '" placeholder="' + key + '" float></ons-input>' +
                  '</div>';

              }


              newItemElement.innerHTML = elementHTML;
              // Add new element to list.
              listElement.appendChild(newItemElement)
            }
          }
        }
      });
    }
  },


  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      var animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    },

    // Remove animation for task deletion.
    remove: function(listItem, callback) {
      listItem.classList.add('animation-remove');
      listItem.classList.add('hide-children');

      setTimeout(function() {
        callback();
      }, 750);
    }
  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [
    {
      title: 'Download OnsenUI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Install Monaca CLI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Star Onsen UI repo on Github',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Register in the community forum',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Send donations to Fran and Andreas',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Profit',
      category: '',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Visit Japan',
      category: 'Travels',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Enjoy an Onsen with Onsen UI team',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    }
  ]
};
