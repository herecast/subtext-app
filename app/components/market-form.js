import Ember from 'ember';
import Validation from '../mixins/components/validation';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { oneWay } = Ember.computed;
const { get, set, run } = Ember;

export default Ember.Component.extend(TestSelector, Validation, {
  tagName: 'form',
  "data-test-component": 'MarketForm',
  post: Ember.computed.alias('model'),
  organizations: oneWay('session.currentUser.managedOrganizations'),

  submit(e) {
    // prevent browser reload when user presses enter in modal dialog
    e.preventDefault();
  },

  validateContact() {
    const email = this.get('post.contactEmail');
    const phone = this.get('post.contactPhone');

    const hasEitherField = Ember.isPresent(email) || Ember.isPresent(phone);

    if (hasEitherField) {
      const hasValidEmail = this.hasValidEmail(email);
      const hasValidPhone = this.hasValidPhone(phone);

      if (hasValidEmail && hasValidPhone) {
        this.set('errors.contact', null);
        delete this.get('errors').contact;
      } else if (!hasValidEmail && hasValidPhone) {
        this.set('errors.contact', 'Invalid email address');
      } else if (hasValidEmail && !hasValidPhone) {
        this.set('errors.contact', 'Invalid phone number');
      } else if (!hasValidEmail && !hasValidPhone) {
        this.set('errors.contact', 'Invalid email address and phone number');
      }
    } else {
      this.set('errors.contact', 'Must include contact info');
    }
  },

  validateForm() {
    this.validatePresenceOf('post.title');
    this.validateWYSIWYG('post.content');
    this.validateContact();
  },

  actions: {
    updateSold(value) {
      set(this, 'post.sold', value);
    },
    discard() {
      const post = this.get('post');
      this.sendAction('afterDiscard', post);
    },
    updateContent(content) {
      set(this, 'post.content', content);
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
