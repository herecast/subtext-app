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

    // Strip out all HTML tags from the content so it can be used for the description
    let tmp = document.createElement("DIV");
    tmp.innerHTML = model.get('content');
    const description = tmp.textContent || tmp.innerText || "";

    return {
      'property': {
        'og:site_name': 'dailyUV',
        'og:image': model.get(imageKey),
        'og:title': model.get('title'),
        'og:description': description,
        'og:url': `${location.protocol}//${location.host}${location.pathname}`
      }
    };
  }
});
