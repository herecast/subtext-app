import Ember from 'ember';
import Validations from 'subtext-ui/mixins/components/validation';

const { get, inject, isPresent, RSVP } = Ember;

export default Ember.Controller.extend(Validations, {
  digest: null,
  email: null,
  api: inject.service(),

  validateForm() {
    this.set('errors', {});

    this.validatePresenceOf('email');

    const email = get(this, 'email');
    if(isPresent(email)) {
      if (this.hasValidEmail(email)) {
        delete this.get('errors')['email'];
      } else {
        this.set('errors.email', 'Invalid email address');
      }
    }
  },

  actions: {
    unsubscribe() {
      if(this.isValid()) {
        const digestId = get(this, 'model.id');
        const email = get(this, 'email');

        return get(this, 'api').unsubscribeFromDigest(
          digestId,
          email
        );
      } else {
        return RSVP.reject();
      }
    }
  }
});
