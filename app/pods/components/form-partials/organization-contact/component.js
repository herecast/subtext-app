import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {get, getProperties, set, isPresent, isBlank, run} = Ember;

export default Ember.Component.extend(Validation, {

  organization: null,
  model: null,
  onFormUpdate() {},

  didReceiveAttrs() {
    this._super(...arguments);

    if (isBlank(get(this, 'model'))) {
      set(this, 'model', {});
    }

    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      set(this, 'model', getProperties(organization, [
        'address',
        'city',
        'state',
        'zip',
        'email',
        'phone',
        'website',
        'twitterHandle'
      ]));
    }
  },

  validateForm() {
    this.validateEmail();
  },

  validateEmail() {
    const email = get(this, 'model.email');
    if (isPresent(email) && !this.hasValidEmail(email)) {
      set(this, 'errors.email', 'Valid email is required');
    } else {
      set(this, 'errors.email', null);
      delete get(this, 'errors')['email'];
    }
  },

  validateTwitter() {
    const twitterHandle = get(this, 'model.twitterHandle');
    if (isPresent(twitterHandle) && !this.hasValidEmail(twitterHandle)) {
      set(this, 'errors.email', 'Valid email is required');
    } else {
      set(this, 'errors.email', null);
      delete get(this, 'errors')['email'];
    }
  },

  formUpdated() {
    this.onFormUpdate(this.isValid(), get(this, 'model'));
  },

  actions: {
    formUpdated() {
      run.debounce(this, this.formUpdated, 100);
    }
  }
});
