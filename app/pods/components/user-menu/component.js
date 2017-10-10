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
  userLocation: inject.service(),

  actions: {
    openDashboard(org) {
      if (isPresent(org)) {
        get(this, 'routing').transitionTo('dashboard', null, {
          organization_id: org.id
        });
      } else {
        get(this, 'routing.router').transitionTo('feed', {queryParams: {
          radius: 'me',
          page: 1
        }});
      }

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
