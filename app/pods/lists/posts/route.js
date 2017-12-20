import Ember from 'ember';

const {
  get,
  set,
  inject,
  RSVP: {Promise},
  isPresent
} = Ember;

export default Ember.Route.extend({
  session: inject.service(),
  fastboot: inject.service(),
  logger: inject.service(),

  model(params) {
    return this.store.findRecord('listserv-content', params.id);
  },

  afterModel(model, transition) {
    this.ensureNotAlreadyVerified(model);
    this.ensureNotUserMismatch(model);


    if(!get(this, 'fastboot.isFastBoot')) {
      if('auth_token' in transition.queryParams) {
        return this.trySignInWithToken(transition.queryParams.auth_token);
      }
    }
  },

  trySignInWithToken(token) {
    return new Promise((resolve)=> {
      get(this, 'session').signInWithToken(token)
        .catch((e)=>{
          get(this, 'logger').error('An error occurred signing in with an auth token', e);
        })
        .finally(resolve);
    });
  },

  ensureNotAlreadyVerified(model) {
    if(isPresent(model.get('verifiedAt'))) {
      this.transitionTo('lists.posts.confirmed');
    }
  },

  ensureNotUserMismatch(model) {
    const sessionUserId = get(this, 'session.currentUser.userId');
    const modelUserId = get(model, 'userId');

    //in the case that we have both, and they don't match, we need to logout the user
    if(sessionUserId && (sessionUserId !== modelUserId)) {
      //logout user
      set(this, 'session.skipRedirect', true);
      get(this, 'session').invalidate();
    }
  },

  actions: {
    authChanged() {
      // Auth changed, make sure it's the same account.
      this.ensureNotUserMismatch(
        this.modelFor(this.routeName)
      );
    }
  }
});
