import Ember from 'ember';
import RouteMetaMixin from 'ember-cli-meta-tags/mixins/route-meta';

export default Ember.Mixin.create(RouteMetaMixin, {
  // Override where needed
  modelForMetaTags: function() {
    return this.modelFor(this.routeName);
  },

  meta() {
    const model = this.modelForMetaTags();
    const imageKey = this.get('modelImageKey');

    return {
      'property': {
        'og:image': model.get(imageKey),
        'og:title': model.get('title'),
        'og:url': `${location.protocol}//${location.host}${location.pathname}`
      }
    };
  }
});
