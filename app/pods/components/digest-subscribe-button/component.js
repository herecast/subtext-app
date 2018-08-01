import Ember from 'ember';

const { get, set, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'DigestSubscribeButton',
  classNameBindings: ['loggingIn:logging-in'],

  modals: service(),
  store: service(),
  session: service(),

  organization: null,
  subscription: null,

  hasSubscription: computed.notEmpty('subscription'),

  init() {
    this._super(...arguments);

    if (get(this, 'session.isAuthenticated')) {
      this._loadSubscriptions();
    }
  },

  _loadSubscriptions() {
    const organization = get(this, 'organization');

    if (get(organization, 'digestId')) {
      get(this, 'store').findAll('subscription')
      .then(subscriptions => {
        const subscription = subscriptions.findBy('digestId', parseInt(get(organization, 'digestId')));

        if (!get(this, 'isDestroyed')) {
          set(this, 'subscription', subscription);
        }
      });
    }
  },

  _makeNewSubscription() {
    get(this, 'session.currentUser')
    .then((currentUser) => {
      get(this, 'store').createRecord('subscription', {
        name: get(currentUser, 'name'),
        email: get(currentUser, 'email'),
        userId: get(currentUser, 'userId'),
        listservId: get(this, 'organization.digestId')
      })
      .save()
      .then((newSubscription) => {
        set(this, 'subscription', newSubscription);
      });
    });
  },

  _removeSubscription() {
    get(this, 'subscription').destroyRecord()
    .then(() => {
      set(this, 'subscription', null);
    });
  },

  _toggleSubscription() {
    if (get(this, 'hasSubscription')) {
      this._removeSubscription();
    } else {
      this._makeNewSubscription();
    }
  },

  actions: {
    toggleSubscription() {
      if (get(this, 'session.isAuthenticated')) {
        this._toggleSubscription();
      } else {
        set(this, 'loggingIn', true);

        get(this, 'modals').showModal('modals/sign-in-register', {
          model: 'sign-in',
          alternateSignInMessage: 'Please sign in or register to subscribe to this daily newsletter'
        })
        .then(() => {
          this._toggleSubscription();
        })
        .finally(() => {
          set(this, 'loggingIn', false);
        });
      }
    }
  }
});
