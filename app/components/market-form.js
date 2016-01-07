import Ember from 'ember';
import Validation from '../mixins/components/validation';

export default Ember.Component.extend(Validation, {
  tagName: 'form',
  post: Ember.computed.alias('model'),

  validateContact() {
    const email = this.get('post.contactEmail');
    const phone = this.get('post.contactPhone');

    const hasEitherField = Ember.isPresent(email) || Ember.isPresent(phone);

    if (hasEitherField) {
      if (this.hasValidEmail(email)) {
        this.set('errors.contact', null);
        delete this.get('errors').contact;
      } else {
        this.set('errors.contact', 'Invalid email address');
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
    discard() {
      const post = this.get('post');
      this.sendAction('afterDiscard', post);
    }
  }
});
