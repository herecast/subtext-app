import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',

  actions: {
    save() {
      const event = this.get('event');

      event.save().then(() => {
        this.sendAction('afterSave');
      });
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
