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

  // Email extendings
  Email.Model = Backbone.Model.extend({});
  Email.Collection = Backbone.Collection.extend({
    url: '/assets/data/email.json'
  });

  // Required, return the module for AMD compliance
  return Email;

});
