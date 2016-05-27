import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';
import DocTitleFromContent from '../../mixins/routes/title-token-from-content';
import ShareCaching from '../../mixins/routes/share-caching';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

const { getOwner } = Ember;

export default Ember.Route.extend(Redirect, RouteMetaMixin, DocTitleFromContent, ShareCaching, ResetScroll, {
  modelImageKey: 'coverImageUrl',

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  },

  afterModel: function(market) {
    this._super(...arguments);

    const path = getOwner(this).lookup('router:main').generate(this.get('routeName'), market);
    this.facebookRecache(path);
  }
});
