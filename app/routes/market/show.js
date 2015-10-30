import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';
import RecacheFacebook from '../../mixins/routes/recache-facebook';

export default Ember.Route.extend(Redirect, RouteMetaMixin, RecacheFacebook, {
  modelImageKey: 'coverImageUrl',

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  }
});
