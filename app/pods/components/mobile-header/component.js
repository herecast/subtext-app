import Ember from 'ember';

const {
  get,
  set,
  inject,
  computed,
  RSVP
} = Ember;

export default Ember.Component.extend({
  tagName            : 'div',
  classNames         : ['MobileHeader'],
  classNameBindings  : ['headerBGClass'],
  modals             : inject.service(),
  features           : inject.service('feature-flags'),
  currentController  : inject.service(),
  store              : inject.service(),
  currentChannel     : computed.alias('currentController.currentChannel'),
  padBody            : computed.alias('currentController.showHeader'),

  headerBGClass: computed('currentChannel', function() {
    return `MobileHeader--${get(this, 'currentChannel')}`;
  }),

  init() {
    this._super(...arguments);

    set(this, 'padBody', true);
  },

  willDestroyElement() {
    this._super(...arguments);

    set(this, 'padBody', false);
  },

  actions: {
    openSearch() {
      this.sendAction('openSearch');
    },
    openUserMenu() {
      const modals = get(this, 'modals');
      const store = get(this, 'store');

      const model = RSVP.hash({
        digests: store.findAll('digest'),
        subscriptions: get(this, 'store').findAll('subscription')
      });

      modals.showModal('modals/user-menu', model);
    },
    signInModal() {
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },
    registerModal() {
      get(this, 'modals').showModal('modals/sign-in-register', 'register');
    }

  }
});
