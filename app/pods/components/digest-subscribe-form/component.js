import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';

const {
  get,
  set,
  inject,
  computed,
  isPresent
  } = Ember;

export default Ember.Component.extend(Validation, {
  classNames: ['DigestSubscribe'],
  tagName: 'form',

  // Component must be instantiated with selected digest
  digest: null,

  email: null,
  showSuccessMessage: false,
  errors: {},

  api: inject.service(),
  session: inject.service(),
  store: inject.service(),
  toast: inject.service(),

  currentUser: computed.alias('session.currentUser'),

  _subscribeToDigest({ name, id }, email) {
    const toast = get(this, 'toast');
    const store = get(this, 'store');

    store.findRecord('listserv', id).then(function(listserv) {
      store.createRecord('subscription', { email, name, listserv }).save().then(
        () => toast.success('You are successfully registered!'),
        () => toast.error('Error: Unable to register')
      );
    }).catch(() => toast.error('Error: Unable to register'));
  },

  _clearEmailError() {
    this.set(`errors.email`, null);
    delete this.get('errors')['email'];
  },

  submit(e) {
    e.preventDefault();

    const email = get(this, 'email');
    const digest = get(this, 'digest');
    const toast = get(this, 'toast');

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
          toast.info(`Please complete your DailUV registration to subscribe to ${get(digest, 'name')}`);
          this.sendAction('registerUserWithDigest', {email, digest});
        });
      } else {
        set(this, 'errors.email', 'Valid email is required.');
      }
    }
  }
});
