import Ember from 'ember';

export default Ember.Mixin.create({
  recache: function() {
    Ember.$.post('https://graph.facebook.com', {
      scrape: true,
      id: window.location.href
    });
  }
});
