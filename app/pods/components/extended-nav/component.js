import Ember from 'ember';

const { get, inject } = Ember;

export default Ember.Component.extend({
  tagName: 'ul',
  intercom: inject.service(),

  actions: {
    onLinkClick() {
      const onLinkClick = get(this, 'onLinkClick');
      if (onLinkClick) {
        onLinkClick();
      }

      return true;
    },

    sendFeedback() {
      get(this, 'intercom').contactUs();
      this.send('onLinkClick');
    }
  }
});
