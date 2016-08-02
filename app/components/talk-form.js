import Ember from 'ember';
import Validation from '../mixins/components/validation';

const {set, computed, computed: { oneWay } } = Ember;

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  talk: Ember.computed.alias('model'),
  organizations: oneWay('session.currentUser.managedOrganizations'),
  image: computed.alias('model.image'),

  validateForm() {
    this.validatePresenceOf('talk.title');
    this.validateWYSIWYG('talk.content');
    this.validateImage();
  },

  actions: {
    discard() {
      const talk = this.get('talk');
      this.sendAction('afterDiscard', talk);
    },
    updateContent(content) {
      set(this, 'talk.content', content);
      this.send('validateForm');
    }
  }
});
