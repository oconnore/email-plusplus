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
    comparator: function( email ) {
      if( email.get('read') ) {
        return 1
      } else {
        return -email.get("date");
      }
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

  Email.Views.SidebarList= Backbone.View.extend({
    template: 'email/list',
    render: function( manage ){
      var view = manage(this);
      var that = this;
      this.collection.each(function( model ) {
        var itemView = new Email.Views.SidebarItem({ 
          className: that.className || '',
          model: model
        });
        itemView.template = that.modelTemplate || 'email/sidebaritem';
        itemView.clickEvent = that.clickEvent || 'showbody';
        view.insert( '.list', itemView, true );
      });

      return view.render();
    }
  });

  Email.Views.SidebarItem = Backbone.View.extend({
    tagName: 'li',
    template: 'email/sidebaritem',
    events: {
      "click": function(){
        app.trigger(this.clickEvent || 'showbody', this.model);
      }
    },
    serialize: function() {
      return { model: this.model };
    }
  });

  Email.Views.Sidebar = Backbone.View.extend({
    template: 'email/sidebar',
    events: {
      "click .sender": function(){
        app.trigger('sortbysender', { collection: Email.collections.senders, render: true });
      },
      "click .unread": function(){
        app.trigger('sortbyunread', { collection: Email.collections.unreadEmails, render: true });
      },
      "click .date": function(){
        app.trigger('sortbydate', { collection: Email.collections.emails, render: true });
      },
      "click .sent": function(){
        app.trigger('sortbysent', { collection: Email.collections.sentEmails, render: true });
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
