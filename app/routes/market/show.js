import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';
import DocTitleFromContent from '../../mixins/routes/title-token-from-content';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, ResetScroll, {
  modelImageKey: 'coverImageUrl',
  modelChannel: 'market',

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  }
});
