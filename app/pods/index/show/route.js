import Ember from 'ember';
//import Linkable from 'ember-cli-link-tags/mixins/linkable';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';
import rejectWithHttpStatus from 'subtext-ui/utils/reject-with-http-status';

const { get, set, isPresent } = Ember;

export default Ember.Route.extend(ModalRoute,/* Linkable, */RouteMetaMixin, RouteNameAdContext, {

  model(params) {
    if ('ctype' in params && isPresent(params.ctype)) {
      const type = normalizeContentType(params.ctype);
      set(this, 'channel', type);
      return this.store.findRecord(type, params.id);
    } else {
      return rejectWithHttpStatus(404);
    }
  },

  afterModel(model) {
    const titleToken = get(model, 'title');

    set(this, 'titleToken', titleToken);
  }
});
