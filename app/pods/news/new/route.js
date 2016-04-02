import Ember from 'ember';
import Scroll from 'subtext-ui/mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import trackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Route.extend(Authorized, Scroll, trackEvent, {
  titleToken: 'Create News',

  model(params, transition) {
    let newRecordValues = {};

    if ('organization_id' in transition.queryParams) {
      return this.store.findRecord('organization', transition.queryParams.organization_id).then((organization) => {
        newRecordValues.organization = organization;
        return this.store.createRecord('news', newRecordValues);
      });
    } else {
        return this.store.createRecord('news');
    }
  },
  afterModel(model) {
    // TODO we need to save for the ember data dirty
    // state flags to work properly. This is a
    // hack for now -- we will need to figure
    // out when a model isNew and
    // has changes so we can avoid doing this
    model.save();
  }
});
