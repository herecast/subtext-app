import Ember from 'ember';

export default Ember.Service.extend({
  mixpanel: Ember.inject.service('mixpanel'),
  intercom: Ember.inject.service('intercom'),

  getCurrentUser: function() {
    // The current user endpoint does not take an ID, so we pass 'self' so that
    // it requests a single resource
    return this.store.find('current-user', 'self').then((user) => {
      this.set('currentUser', user);

      const mixpanel = this.get('mixpanel');

      mixpanel.identify(user.get('userId'));
      mixpanel.peopleSet({
        name: user.get('name')
      });

      const intercom = this.get('intercom');

      intercom.boot(user);
    }).catch(() => {
      this.set('currentUser', null);
    });
  }
});
