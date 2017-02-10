import Ember from 'ember';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';
import ModalRoute from 'subtext-ui/mixins/routes/modal-route';

export default Ember.Route.extend(ModalRoute, RouteMetaMixin, DocTitleFromContent, {
  channel: 'news',

  model(params)  {
    return this.store.findRecord('news', params.id, { reload: true }).catch(() => {
      this.replaceWith('error-404');
    });
  }
});
