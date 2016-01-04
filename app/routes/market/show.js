import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';
import DocTitleFromContent from '../../mixins/routes/title-token-from-content';

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, {
  modelImageKey: 'coverImageUrl',

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  }
});
