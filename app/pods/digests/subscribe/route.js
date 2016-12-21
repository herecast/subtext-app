import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('digest', params.id);
  },

  actions: {
    registerUserWithDigest({digest, email}) {
      this.transitionTo('register', {
        queryParams: {
          selectedDigest: digest.id,
          email
        }
      });
    }
  }
});