import MystuffNavObjects from 'subtext-ui/mixins/mystuff-nav-objects';
import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend(MystuffNavObjects, {
  classNames: 'SiteNav-UserMenu',

  modals: service(),
  session: service(),
  routing: service('_routing'),

  afterChoose: function() {},

  isLoggedIn: computed.readOnly('session.isAuthenticated'),
  currentUser: computed.readOnly('session.currentUser'),

  managedOrganizations: computed.readOnly('currentUser.managedOrganizations'),
  hasManagedOrganizations: computed.gt('managedOrganizations.length', 0),

  actions: {
    goTo(...params) {
      get(this, 'afterChoose')();
      get(this, 'routing.router').transitionTo(...params);
    },

    signIn() {
      get(this, 'afterChoose')();
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },

    goToMystuffRoute(route) {
      get(this, 'afterChoose')();
      get(this, 'routing.router').transitionTo(route.routeName);
    }
  }
});
