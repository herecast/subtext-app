import Ember from 'ember';
import Validation from '../mixins/components/validation';

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  talk: Ember.computed.alias('model'),

  isValid() {
    this.validatePresenceOf('talk.title');
    this.validatePresenceOf('talk.content');
    return Ember.isBlank(Ember.keys(this.get('errors')));
  },

  actions: {
    next() {
      if (this.isValid()) {
        this.sendAction('afterDetails');
      } else {
        // TODO make it more obvious that there's an error and the user
        // needs to make corrections.
        console.log(this.get('errors'));
      }
    },

    discard() {
      const talk = this.get('talk');
      this.sendAction('afterDiscard', talk);
    }
  }
});
