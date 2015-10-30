import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';

export default Ember.Route.extend(Redirect, RouteMetaMixin, {
  modelImageKey: 'coverImageUrl',

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  },

  actions: {
    didTransition() {
      console.log('did transition');
      console.log(window.location);
    }
  }
});
