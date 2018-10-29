import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { set, get, setProperties } from '@ember/object';
import { isPresent } from '@ember/utils';
import Validation from 'subtext-ui/mixins/components/validation';

export default Component.extend(Validation, {
  classNames: ['DigestSubscribe'],
  tagName: 'form',

  api: service(),
  session: service(),
  store: service(),
  notify: service('notification-messages'),

  digest: null,
  email: null,
  showSuccessMessage: false,

  init() {
    this._super(...arguments);
    setProperties(this, {
      errors: {}
    });
  },

  currentUser: alias('session.currentUser'),

  _subscribeToDigest({ name, id }, email) {
    const notify = get(this, 'notify');
    const store = get(this, 'store');

    store.findRecord('digest', id).then((digest) => {
      const digestId = digest.id;
      store.createRecord('subscription', { email, name, digestId }).save().then(
        () => {
          notify.success('You are successfully registered!');
        },
        () => notify.error('Error: Unable to register')
      );
    }).catch(() => notify.error('Error: Unable to register'));
  },

  _clearEmailError() {
    this.set(`errors.email`, null);
    delete this.get('errors')['email'];
  },

  submit(e) {
    e.preventDefault();

    const email = get(this, 'email');
    const digest = get(this, 'digest');
    const notify = get(this, 'notify');

    if (get(this, 'session.isAuthenticated')) {
      this._subscribeToDigest(digest, get(this, 'currentUser.email'));
      set(this, 'showSuccessMessage', true);
    } else {
      if (isPresent(email) && this.hasValidEmail(email)) {
        this._clearEmailError();
        get(this, 'api').isRegisteredUser(email).then(() => {
          this._subscribeToDigest(digest, email);

          set(this, 'showSuccessMessage', true);
        }).catch(() => {
          notify.info(`Please complete your DailUV registration to subscribe to ${get(digest, 'name')}`);
          //eslint-disable-next-line ember/closure-actions
          this.sendAction('registerUserWithDigest', {email, digest});
        });
      } else {
        set(this, 'errors.email', 'Valid email is required.');
      }
    }
  }
});
