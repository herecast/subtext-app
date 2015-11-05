import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';
import RouteMetaMixin from '../../mixins/routes/social-tags';
import ShareCaching from '../../mixins/routes/share-caching';

export default Ember.Route.extend(Redirect, RouteMetaMixin, ShareCaching, {
  modelImageKey: 'bannerImage.url',

  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true });
  },

  afterModel: function(news, transition) {
    const path = this.get('container').lookup('router:main').generate(this.get('routeName'), news);
    this.facebookRecache(path);
  }

});
