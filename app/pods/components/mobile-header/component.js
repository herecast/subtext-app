import Ember from 'ember';

const {
  get,
  set,
  inject,
  computed
} = Ember;

export default Ember.Component.extend({
  tagName            : 'div',
  classNames         : ['MobileHeader'],
  classNameBindings  : ['headerBGClass'],

  currentController  : inject.service(),
  currentChannel     : computed.alias('currentController.currentChannel'),
  padBody            : computed.alias('currentController.showHeader'),
  modals             : inject.service(),

  headerBGClass: computed('currentChannel', function() {
    return `${get(this, 'classNames.lastObject')}--${get(this, 'currentChannel')}`;
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
      const currentUser = get(this, 'session.currentUser');
      const modals = get(this, 'modals');

      modals.showModal('modals/user-menu', currentUser);
    }
  }
});
