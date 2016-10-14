import Ember from 'ember';

const {
  get,
  run,
  inject,
  isPresent
} = Ember;

export default Ember.Component.extend({
  classNames: ['UserMenu'],
  tagName: 'ul',
  'data-test-component': 'user-menu',
  session: inject.service('session'),
  routing: inject.service('-routing'),

  actions: {
    openDashboard(org) {
      let id = null;

      if(isPresent(org)) {
        id = org.id;
      }

      get(this, 'routing').transitionTo('dashboard', null, {
        organization_id: id
      });

      if("action" in this.attrs) {
        this.attrs.action();
      }
    },
    myAccount() {
      this.attrs.openMyAccount(
        get(this, 'model')
      );
    },
    signOut() {
      if('signOut' in this.attrs) {
        this.attrs.signOut();
      } else {
        get(this, 'session').invalidate();
        if("action" in this.attrs) {
          this.attrs.action();
        }
      }
    },
    linkAction() {
      if('action' in this.attrs) {
        run.next(() => {
          this.attrs.action();
        });
      }
    }
  }
});
