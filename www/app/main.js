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
      "": "index"
    },

    index: function() {
      var emails = new Email.Collection();
      window.emails = emails;

      emails.fetch().success(function(){
        var main = new Backbone.LayoutManager({
          template: 'main',
          views: {
            '#sidebar': new Email.Views.Sidebar()
          }
        });
        
        emails.each(function(email) {
          main.views['#sidebar'].view("ul", new Email.Views.SidebarItem({ model: email}), true);
          
        });
        
        app.bind('showbody', function( model){
          var reader = main.view('#reader', new Email.Views.Reader({ model: model }));
          reader.render();
        });
        
        main.render(function( el ){
          $('#main').html( el );
        })
        
      });
      console.log(emails.models.length);
      
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
