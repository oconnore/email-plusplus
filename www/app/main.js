require([
  "namespace",

  // Libs
  "jquery",
  "use!backbone",

  // Modules
  "modules/email"
],

function(epp, jQuery, Backbone, Email) {

  var app = epp.app;

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "compose": "compose"
    },

    index: function() {
      var emails = new Email.Collection();
      var unreadEmails = new Email.Collection();
      window.emails = emails;
      window.Email = Email;
      window.unreadEmails = unreadEmails;
      Email.collections = {};

      emails.fetch().success(function(){
        var main = new Backbone.LayoutManager({
          template: 'main',
          views: {
            '#sidebar': new Email.Views.Sidebar({ model: emails })
          }
        });

        window.main = main;
        
        // Render the navigation
        var nav = main.view('#mainnav', new Email.Views.Nav(), true);

        // Organize a new collection of emails according to sender
        var senders = new Email.SenderCollection();
        window.senders = senders;
        
        
        // Iterate over all the emails 
        emails.each(function( email ){
          // If we haven't put this sender in the senders collection, do it
          if( !senders.get(email.get('fromemail')) ){
            senders.add({
              id: email.get('fromemail'),
              name: email.get('fromname'),
              allMail: new Email.Collection(),
              read: new Email.Collection(),
              unread: new Email.Collection()
            });

            // if the current email is unread, create a new unread collection for it
            if( !email.get('read') ){
              senders.get( email.get('fromemail') ).get( 'unread' ).add( email );
              senders.get( email.get('fromemail') ).get( 'allMail' ).add( email );
              unreadEmails.add( email );
            // otherwise, create a new read collection for it
            } else {
              senders.get( email.get('fromemail') ).get( 'read' ).add( email );
              senders.get( email.get('fromemail') ).get( 'allMail' ).add( email );
            }
          // if we have already pyt this sender in the senders collection
          } else {
            // if the email is unread add it to the unread collection
            if( !email.get('read') ){
              senders.get( email.get('fromemail') ).get('unread').add( email );
              senders.get( email.get('fromemail') ).get( 'allMail' ).add( email );
              unreadEmails.add( email );
            // if the email is unread add it to the read collection
            } else {
              senders.get( email.get('fromemail') ).get('read').add( email );
              senders.get( email.get('fromemail') ).get( 'allMail' ).add( email );
            }
          }

          Email.collections['senders'] = senders;
          Email.collections['emails'] = emails;
          Email.collections['unreadEmails'] = unreadEmails;

        });

        app.bind('sortbysender', function( senders ){
          var sendersList = new Email.Views.SidebarList({ collection: senders.collection });
          sendersList.modelTemplate = 'email/sidebaritem-sender';
          sendersList.clickEvent = 'showsendermail';
          var layoutSendersList = main.views['#sidebar'].view( "#sidebarlist", sendersList);
          if( senders.render ){
            layoutSendersList.render();
          }

          $('nav.btn-group')
            .children().removeClass('active')
            .end()
            .children('.sender').addClass('active')
        });
          
        app.bind('showsendermail', function( sender ){
          var emailListUnread = new Email.Views.SidebarList({ collection: sender.get('allMail') });
          var as1 = main.views['#sidebar'].views['#sidebarlist'].view( '#' + sender.cid, emailListUnread).render();
        });

        app.bind('sortbyunread', function( emails ){
          var emailList = new Email.Views.SidebarList({ collection: emails.collection });
          emailList.className = 'btn';
          main.views['#sidebar'].view( '#sidebarlist', emailList ).render();

          $('nav.btn-group')
            .children().removeClass('active')
            .end()
            .children('.unread').addClass('active')
        });

        app.bind('sortbydate', function( emails ){
          var emailList = new Email.Views.SidebarList({ collection: emails.collection });
          emailList.className = 'btn';
          main.views['#sidebar'].view( '#sidebarlist', emailList ).render();
          
          $('nav.btn-group')
            .children().removeClass('active')
            .end()
            .children('.date').addClass('active')
        });

        app.bind('sortbysent', function( emails ){
          $('nav.btn-group')
            .children().removeClass('active')
            .end()
            .children('.sent').addClass('active')
        });

        app.bind('showbody', function( model){
          var reader = main.view('#reader', new Email.Views.Reader({ model: model }));
          reader.render();
        });

        app.bind('showwriter', function( model){
          var writer = main.view('#reader', new Email.Views.Writer({ model: model }));
          writer.render(function(){
            $('.writer').focus()
          });
        });

        // Render the main emails layout manager
        main.render(function( el ){
          $('#main').html( el );
        });

        // Render the Senders list by default
        app.trigger('sortbysender', { collection: senders, render: false });
      });
    },
    compose: function() {
      epp.app.router.index();
      var writer = new Email.Views.Writer();
      writer.render();
    }
    
  });

  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  jQuery(function($) {
    // Shorthand the application namespace
    var app = epp.app;
    
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new Router();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true });
  });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router.  If the link has a data-bypass
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // This uses the default router defined above, and not any routers
      // that may be placed in modules.  To have this work globally (at the
      // cost of losing all route events) you can change the following line
      // to: Backbone.history.navigate(href, true);
      app.router.navigate(href, true);
    }
  });

});
