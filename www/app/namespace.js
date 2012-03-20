define([
  // Libs
  "jquery",
  "use!underscore",
  "use!backbone",
  "date",
  "use!plugins/backbone.layoutmanager"
],

function($, _, Backbone) {
  Backbone.LayoutManager.configure({
    paths: {
      layout: 'app/templates/layouts/',
      template: 'app/templates/'
    },
    fetch: function( path ){
      path = path + '.html';
      var done = this.async();
      var JST = window.JST = window.JST || {};

      // Should be an instant synchronous way of getting the template, if it
      // exists in the JST object.
      if (JST[path]) {
        return done(JST[path]);
      }

      // Fetch it asynchronously if not available from JST
      return $.get(path, function(contents) {
        var tmpl = _.template(contents);
        JST[path] = tmpl;
        done(tmpl);
      });
    }
  });
  return {
    // This is useful when developing if you don't want to use a
    // build process every time you change a template.
    //
    // Delete if you are using a different template loading method.
    fetchTemplate: function(path, done) {
      var JST = window.JST = window.JST || {};

      // Should be an instant synchronous way of getting the template, if it
      // exists in the JST object.
      if (JST[path]) {
        return done(JST[path]);
      }

      // Fetch it asynchronously if not available from JST
      return $.get(path, function(contents) {
        var tmpl = _.template(contents);
        JST[path] = tmpl;
        done(tmpl);
      });
    },

    // Create a custom object with a nested Views object
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Keep active application instances namespaced under an app object.
    app: _.extend({}, Backbone.Events)
  };
});
