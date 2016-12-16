import Ember from 'ember';
//import Linkable from 'ember-cli-link-tags/mixins/linkable';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';

const { get, set } = Ember;

export default Ember.Route.extend(ModalRoute,/* Linkable, */RouteMetaMixin, {

  model(params, transition) {
    const type = normalizeContentType(params.ctype) || null;
    set(this, 'channel', type);

    if (type) {
      return this.store.findRecord(type, params.id).catch(() => {
        this.replaceWith('error-404');
      });
    } else {
      transition.abort();
    }
  },

  afterModel(model) {
    const titleToken = get(model, 'title');

    set(this, 'titleToken', titleToken);
  }
});
