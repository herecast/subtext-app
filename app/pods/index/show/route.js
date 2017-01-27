import Ember from 'ember';
//import Linkable from 'ember-cli-link-tags/mixins/linkable';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';

const { get, set } = Ember;

export default Ember.Route.extend(ModalRoute,/* Linkable, */RouteMetaMixin, RouteNameAdContext, {

  model(params) {
    const type = normalizeContentType(params.ctype) || null;
    set(this, 'channel', type);

    if (type) {
      return this.store.findRecord(type, params.id);
    } else {
      // Non-existent page was requested. Return a 404 and render the 404 page without doing a redirect
      if (get(this, 'fastboot.isFastBoot')) {
        set(this, 'fastboot.response.statusCode', 404);
      }
      this.intermediateTransitionTo('error-404');
    }
  },

  afterModel(model) {
    const titleToken = get(model, 'title');

    set(this, 'titleToken', titleToken);
  }
});
