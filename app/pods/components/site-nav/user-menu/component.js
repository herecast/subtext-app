import { get } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'SiteNav-UserMenu',
  classNameBindings: ['isLoggedIn:is-logged-in'],

  modals: service(),
  session: service(),

  afterChoose: function() {},

  isLoggedIn: readOnly('session.isAuthenticated'),
  currentUser: readOnly('session.currentUser'),

  actions: {
    signIn() {
      get(this, 'afterChoose')();
      get(this, 'modals').showModal('modals/sign-in-register', 'sign-in');
    },

    signUp() {
      get(this, 'afterChoose')();
      get(this, 'modals').showModal('modals/sign-in-register', 'register');
    },

    onLinkClick() {
      get(this, 'afterChoose')();
    }
  }
});
