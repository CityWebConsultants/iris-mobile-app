/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  // Based on whether user is authenticated or not, display profile fields or redirect to login page.
  
  contentLoader: function(content,list){

            // Exclude from the form
        var excludeList = [ 'eid', '_id', '__v', 'adminLinks', 'entityAuthor', 'entityType' ];

        // List to add elements to.
        var listElement = document.getElementById(list); //My ons-list element

        for (var key in content.response) {
          // skip loop if the property is from prototype
          if (!content.response.hasOwnProperty(key) || excludeList.indexOf(key) > -1) continue;

          var obj = content.response[key];

          for (var prop in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(prop)) continue;

            if ((typeof obj[prop] != 'undefined') && (excludeList.indexOf(prop) == -1)) {

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
              else if(prop == "field_users"){
                elementHTML += '<label class="center" for="inner-highlight-input">' + prop + '</label>' +
                  '<div class="center">' +
                  '<ons-toolbar-button component="button/members" onclick="fn.push(\'html/group_members.html\', {data: {id: ' + obj.eid + '}})">View Members</ons-toolbar-button>' +
                  '</div>';
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

  },
  nodeCollector : function(list){
        var node = {};
        var listElement = document.getElementById(list); //My ons-list element

        // Get all the fields from the form.
        Array.prototype.forEach.call(listElement.querySelectorAll('.list__item'), function (element) {

          // Get the field name.
          if (element.querySelector('ons-if') != null) {
            var key = element.querySelector('ons-if').innerText;
          }
          else {
            var key = element.querySelector('label').innerText;
          }

          // Get the field value.
          var value;
          if(element.querySelector('textarea')){
            console.log(element.querySelector('textarea'));
             value = element.querySelector('textarea').value;
          }
          if(element.querySelector('input')){
             value = element.querySelector('input').value;
          }
       
          if (element.querySelector('input') && element.querySelector('input').type == 'checkbox') {
            value = element.querySelector('input').checked;
          }

          node[key.toLowerCase()] = value;
        });

        return node;
  },

  user : {

    update : function(eid, list){
      irisCli.displayUser(eid).then(function(user) {
        myApp.services.contentLoader(user,list);
      });
    },
    save : function(uid,list){
        var node = myApp.services.nodeCollector(list);
        irisCli.editUser(uid,node).then(function(user){
          fn.pop({
            refresh: true, callback: function (e) {
              fn.modalHide();
              ons.notification.alert('Profile saved.');
            }
          });
        },function(fail){
          fn.modalHide();
          ons.notification.alert(fail.message);
        });
    }
  },
  node : {

    update : function(eid, list){
      irisCli.displayPage(eid).then(function(page) {
        myApp.services.contentLoader(page,list);
      });
    },
    save : function(uid,list){
        var node = myApp.services.nodeCollector(list);
        if(uid){
          irisCli.editPage(uid,node).then(function(page){
            fn.pop({
              refresh: true, callback: function (e) {
                fn.modalHide();
                ons.notification.alert('Article saved.');
              }
            });
          },function(fail){
            fn.modalHide();
            ons.notification.alert(fail.message);
          });
        }
        else{
          irisCli.createPage(node).then(function(page){
            fn.pop({
              refresh: true, callback: function (e) {
                fn.modalHide();
                ons.notification.alert('Article saved.');
              }
            });
          },function(fail){
            fn.modalHide();
            ons.notification.alert(fail.message);
          });          
       }
    },
    load : function(eid, list){
        irisCli.displayPage(eid).then(function(page) {
         myApp.services.contentLoader(page,list);
      });
    }
  },
  group : {
    update : function(eid, list){
      irisCli.displayGroup(eid).then(function(group) {
        myApp.services.contentLoader(group,list);
      });
    },
    save : function(uid,list){
        var node = myApp.services.nodeCollector(list);
        if(uid){
          irisCli.editGroup(uid,node).then(function(page){
            fn.pop({
              refresh: true, callback: function (e) {
                fn.modalHide();
                ons.notification.alert('Group saved.');
              }
            });
          },function(fail){
            fn.modalHide();
            ons.notification.alert(fail.message);
          });
        }
        else{
          irisCli.createGroup(node).then(function(page){
            fn.pop({
              refresh: true, callback: function (e) {
                fn.modalHide();
                ons.notification.alert('Group saved.');
              }
            });
          },function(fail){
            fn.modalHide();
            ons.notification.alert(fail.message);
          });          
       }
    },
    load : function(eid, list, callback){
      irisCli.displayGroup(eid).then(function(group) {
         myApp.services.contentLoader(group,list);
         callback(group.response[0]);
      });
    },
    join : function(eid){
      
      irisCli.displayGroup(eid).then(function(content) {
        var group = content.response[0];
        if(group.field_users){
          if(!group.field_users.length){
            group.field_users = [];
          }
          group.field_users.push({field_uid: irisCli.currentUser.userid});
        }
        group.members = group.field_users.length;
         irisCli.editGroup(eid,group).then(function(page){
            fn.pop({
                refresh: true, callback: function (e) {
                  fn.modalHide();
                  ons.notification.alert('Successfully joined.');
                }
              });
            },function(fail){
              fn.modalHide();
              ons.notification.alert(fail.message);
        });
      });
      
    },
    leave : function(eid){
      irisCli.displayGroup(eid).then(function(content) {
        var group = content.response[0];
        if(group.field_users){
          var members = [];
          group.field_users.forEach(function(user){
            if(user.field_uid ==  irisCli.currentUser.userid){
            }
            else{
              members.push(user);
            }
          });
          group.field_users = members;
        }
        group.members = group.field_users.length;
         irisCli.editGroup(eid,group).then(function(page){
            fn.pop({
                refresh: true, callback: function (e) {
                  fn.modalHide();
                  ons.notification.alert('Successfully leaved.');
                }
              });
            },function(fail){
              fn.modalHide();
              ons.notification.alert(fail.message);
        });
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
