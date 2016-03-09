import Ember from 'ember';
import Validation from '../mixins/components/validation';

const { oneWay } = Ember.computed;

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  talk: Ember.computed.alias('model'),
  organizations: oneWay('session.currentUser.managed_organizations'),

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
