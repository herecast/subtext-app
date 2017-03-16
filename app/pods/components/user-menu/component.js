import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  run,
  inject,
  isPresent
} = Ember;

export default Ember.Component.extend(TestSelector, {
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

      const action = get(this, 'action');
      if (action) {
        action();
      }
    },
    myAccount() {
      get(this, 'openMyAccount')(
        get(this, 'model')
      );
    },
    signOut() {
      const signOut = get(this, 'signOut');
      if (signOut) {
        signOut();
      } else {
        get(this, 'session').invalidate();
        const action = get(this, 'action');
        if (action) {
          action();
        }
      }
    },
    linkAction() {
      const action = get(this, 'action');
      if (action) {
        run.next(() => {
          action();
        });
      }
    }
  }
});
