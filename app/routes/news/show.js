import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';
import ShareCaching from '../../mixins/routes/share-caching';
import DocTitleFromContent from '../../mixins/routes/title-token-from-content';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Ember.Route.extend(Redirect, RouteMetaMixin, ShareCaching, DocTitleFromContent, ResetScroll, {
  modelImageKey: 'bannerImage.url',

  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true }).catch(() => {
      this.replaceWith('error-404');
    });
  },

  afterModel: function(news) {
    this._super(...arguments);

    const path = this.get('container').lookup('router:main').generate(this.get('routeName'), news);
    this.facebookRecache(path);
  }

});
