import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    publish() {
      const event = this.get('event');
      event.publish();
      this.sendAction('afterPublish');
    },

    discard() {
      if (confirm('Are you sure you want to discard this event?')) {
        const event = this.get('event');
        event.destroyRecord();
        this.sendAction('afterDiscard');
      }
    }
  }
});
