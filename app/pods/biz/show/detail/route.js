import Ember from 'ember';
import Redirect from 'subtext-ui/mixins/routes/redirect-after-login';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';
import normalizeContentType from 'subtext-ui/utils/normalize-content-type';

export default Ember.Route.extend(ModalRoute, Redirect, RouteMetaMixin, DocTitleFromContent, {

  model(params)  {
    const contentType = normalizeContentType(params.contentType);

    return this.store.findRecord(contentType, params.slug, { reload: true });
  }
});
