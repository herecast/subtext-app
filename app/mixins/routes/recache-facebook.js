import Ember from 'ember';

export default Ember.Mixin.create({
  afterModel(model, transition) {
    this._super();
    if (transition.queryParams.recacheFB) {
      Ember.$.post('https://graph.facebook.com', {
        scrape: true,
        id: window.location.origin+window.location.pathname
      });
    }
  }
});
