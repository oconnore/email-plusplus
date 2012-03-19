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
    url: '/assets/data/email.json',
    comparator: function(chapter) {
      return chapter.get("date");
    }
  });

  Email.SenderCollection = Backbone.Collection.extend({});

  Email.Views.Nav = Backbone.View.extend({
    template: 'email/nav',
    events: {
      "click .compose": function(){
        app.trigger('showwriter', this.model);
      }
    }
  });

  Email.Views.SidebarItem = Backbone.View.extend({
    tagName: 'ul',
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

  Email.Views.SidebarItemSender = Backbone.View.extend({
    tagName: 'li',
    className: 'btn',
    template: 'email/sidebaritem-sender',
    events: {
      "click": function(){
        app.trigger('showsendermail', this.model);
      }
    },
    serialize: function() {
      return { sender: this.model };
    }
  });

  Email.Views.SidebarItemDate = Backbone.View.extend({
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
    template: 'email/sidebar',
    events: {
      "click .sender": function(){
        app.trigger('sortbysender', this.model);
      },
      "click .unread": function(){
        app.trigger('sortbyunread', this.model);
      },
      "click .date": function(){
        app.trigger('sortbydate', this.model);
      },
      "click .sent": function(){
        app.trigger('sortbysent', this.model);
      },
      serialize: function() {
        return { emails: this.model };
      }
      
    }
  });

  Email.Views.EmailList = Backbone.View.extend({
    tagName: 'ul',
    template: 'email/emaillist'
  });

  Email.Views.Reader = Backbone.View.extend({
    template: 'email/reader',
    events: {
      "click .reply": function(){
        app.trigger('reply', this.model);
      },
      "click .replyall": function(){
        app.trigger('replyall', this.model);
      },
      "click .fwd": function(){
        app.trigger('fwd', this.model);
      }
    },
    serialize: function() {
      return { email: this.model };
      
    }
  });

  Email.Views.Writer = Backbone.View.extend({
    template: 'email/writer'
  });

  // Required, return the module for AMD compliance
  return Email;

});
