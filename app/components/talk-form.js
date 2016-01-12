import Ember from 'ember';
import Validation from '../mixins/components/validation';

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  talk: Ember.computed.alias('model'),

  validateForm() {
    this.validatePresenceOf('talk.title');
    this.validateWYSIWYG('talk.content');
  },

  actions: {
    discard() {
      const talk = this.get('talk');
      this.sendAction('afterDiscard', talk);
    }
  }
});
