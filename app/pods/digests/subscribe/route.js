import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.find('digest', params.digest_id);
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
