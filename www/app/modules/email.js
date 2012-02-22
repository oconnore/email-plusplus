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

  // Example extendings
  Example.Model = Backbone.Model.extend({});
  Example.Collection = Backbone.Collection.extend({
	  url: '/assets/data/email.json'
  });
  Example.Router = Backbone.Router.extend({ /* ... */ });

  // This will fetch the tutorial template and render it.
  Example.Views.Tutorial = Backbone.View.extend({
    template: "app/templates/example.html",

    render: function(done) {
      var view = this;

      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
        view.el.innerHTML = tmpl();

        done(view.el);
      });
    }
  });

  // Required, return the module for AMD compliance
  return Example;

});
