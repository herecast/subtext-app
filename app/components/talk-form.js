import Ember from 'ember';
import Validation from '../mixins/components/validation';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {get, set, computed, run, computed: { oneWay } } = Ember;

export default Ember.Component.extend(TestSelector, Validation, {
  tagName: 'form',
  "data-test-component": 'TalkForm',
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
    },
    validateForm() {
      if (get(this, 'hasSubmittedForm')) {
        run.later(() => {
          this.validateForm();
        });
      }
    },
    next() {
      set(this, 'hasSubmittedForm', true);

      if (this.isValid()) {
        this.sendAction('afterDetails');
      } else {
        run.later(() => {
          this.scrollToFirstError();
        });
      }
    },

  }
});
