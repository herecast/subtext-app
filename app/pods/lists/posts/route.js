import Ember from 'ember';

const { get, set, inject, isPresent } = Ember;

export default Ember.Route.extend({
  session: inject.service(),
  toast: inject.service(),

  model(params) {
    return this.store.findRecord('listserv-content', params.id);
  },

  afterModel(model) {
    if(isPresent(model.get('verifiedAt'))) {
      get(this, 'toast').info(
        "You have already verified your post. Thank you."
      );
      this.transitionTo('index');
      return;
    }

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
      this.refresh();
    }
  }
});
