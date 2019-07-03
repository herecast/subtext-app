import { readOnly, gt } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import MystuffNavObjects from 'subtext-app/mixins/mystuff-nav-objects';

export default Component.extend(MystuffNavObjects, {
  classNames: 'SiteNav-UserMenu',
  classNameBindings: ['isLoggedIn:is-logged-in'],

  modals: service(),
  session: service(),
  router: service(),

  afterChoose: function() {},

  isLoggedIn: readOnly('session.isAuthenticated'),
  currentUser: readOnly('session.currentUser'),

  managedOrganizations: readOnly('currentUser.managedOrganizations'),
  hasManagedOrganizations: gt('managedOrganizations.length', 0),

  actions: {
    goTo(...params) {
      get(this, 'afterChoose')();
      get(this, 'router').transitionTo(...params);
    },

    signIn() {
      get(this, 'afterChoose')();
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },

    signUp() {
      get(this, 'afterChoose')();
      get(this, 'modals').showModal('modals/sign-in-register', 'register');
    },


    goToMystuffRoute(route) {
      get(this, 'afterChoose')();

      let transition = get(this, 'router').transitionTo(route.routeName);

      transition._keepDefaultQueryParamValues = false;

      transition();
    }
  }
});
