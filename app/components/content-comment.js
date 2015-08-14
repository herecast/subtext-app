import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['Comment'],
  tagName: 'li',
  showReplyBox: false,

  actions: {
    reply() {
      this.toggleProperty('showReplyBox');
    },

    afterPost() {
      this.set('showReplyBox', false);
    }
  }
});
