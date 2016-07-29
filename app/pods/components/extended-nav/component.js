import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Component.extend({
  tagName: 'ul',
  intercom: inject.service(),

  actions: {
    onLinkClick() {
      if ('onLinkClick' in this.attrs) {
        this.attrs.onLinkClick();
      }

      return true;
    },

    sendFeedback() {
      get(this, 'intercom').contactUs();
      this.send('onLinkClick');
    }
  }
});
