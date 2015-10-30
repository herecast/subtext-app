import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['recacheFB'],
  recacheFB: false,

  sendToFB: function() {
    if (this.get('recacheFB')) {
      $.post('https://graph.facebook.com', {
        scrape: true,
        id: encodeURIComponent(window.location.origin+window.location.pathname)
      });
    }
  }.observes('recacheFB')
});
