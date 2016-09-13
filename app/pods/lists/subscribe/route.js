import Ember from 'ember';

const {get, set, isPresent} = Ember;

export default Ember.Route.extend( {
  model(params) {
    return this.store.findRecord('subscription', params.id);
  },

  afterModel(model) {
    const sessionUserId = get(this, 'session.currentUser.userId');
    const modelUserId = get(model, 'userId');

    //in the case that we have both, and they don't match, we need to logout the user
    if(sessionUserId && (sessionUserId !== modelUserId)) {
      //logout user
      set(this, 'session.skipRedirect', true);
      get(this, 'session').invalidate();
    }
    //if user has already subscribed, then we send them to the manage page
    const confirmed_at =  get(model, 'confirmedAt');


    if( isPresent(confirmed_at) ) {
      this.transitionTo('lists.manage', model);
    }
  }


});
