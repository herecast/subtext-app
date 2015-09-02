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

  isValid() {
    this.validatePresenceOf('post.title');
    this.validatePresenceOf('post.content');
    this.validateContact();
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
      if (confirm('Are you sure you want to discard this post?')) {
        const post = this.get('post');
        post.destroyRecord();
        this.sendAction('afterDiscard');
      }
    }
  }
});
