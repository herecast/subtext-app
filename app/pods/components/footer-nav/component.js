import Ember from 'ember';

const {
  get,
  set,
  computed,
  inject,
} = Ember;

export default Ember.Component.extend({
  tagName           : 'nav',
  classNames        : ['FooterNav'],
  classNameBindings : ['hideFooter:is-hidden'],

  footerService     : inject.service('footer'),
  hideFooter        : computed.readOnly('footerService.hideFooter'),

  showExtendedNavMenu: false,

  didInsertElement() {
    get(this, 'footerService').watchEvents();
  },

  willDestroyElement() {
    this._super(...arguments);
    get(this, 'footerService').unwatchEvents();
  },

  actions: {
    closeExtendedNavMenu() {
      set(this, 'showExtendedNavMenu', false);
    },
    openExtendedNavMenu() {
      set(this, 'showExtendedNavMenu', true);
    }
  }
});
