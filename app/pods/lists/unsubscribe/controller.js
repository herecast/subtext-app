import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get } from '@ember/object';
import { isPresent } from '@ember/utils';
import RSVP from 'rsvp';
import Validations from 'subtext-app/mixins/components/validation';

export default Controller.extend(Validations, {
  digest: null,
  email: null,
  api: service(),

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
