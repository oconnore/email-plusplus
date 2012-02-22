define([
  "namespace",

  // Libs
  "use!backbone"

  // Modules

  // Plugins
],

function(epp, Backbone) {

  // Create a new module
  var Email = epp.module();

  var app = epp.app;

  // Email extendings
  Email.Model = Backbone.Model.extend({});
  Email.Collection = Backbone.Collection.extend({
    url: '/assets/data/email.json'
  });

  Email.Views.SidebarItem = Backbone.View.extend({
    tagName: 'li',
    className: 'btn',
    template: 'email/sidebaritem',
    events: {
      "click": function(){
        app.trigger('showbody', this.model);
      }
    },
    serialize: function() {
      return { email: this.model };
      
    }
  });

  Email.Views.Sidebar = Backbone.View.extend({
    template: 'email/sidebar'
  });

  Email.Views.Reader = Backbone.View.extend({
    template: 'email/reader',
    events: {
      "click .reply": function(){
        console.log( "reply" );
      },
      "click .replyall": function(){
        console.log( "replyall" );
      },
      "click .fwd": function(){
        console.log( "fwd" );
      }
    },
    serialize: function() {
      return { email: this.model };
      
    }
  });

  // Required, return the module for AMD compliance
  return Email;

});
