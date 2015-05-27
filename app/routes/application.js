import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  beforeModel() {
    const session = this.get('session');

    return session.getCurrentUser();
  },

  actions: {
    signOut() {
      ajax('/users/sign_out', {type: 'delete'}).then(() => {
        window.location.reload();
      });
    }
  }
});
