import Ember from 'ember';
import History from 'subtext-ui/mixins/routes/history';

const {get} = Ember;

export default Ember.Route.extend(History, {

  model(params) {
    return this.store.findRecord('organization', params.organization_id);
  },

  titleToken(model) {
    return get(model, 'organization.name');
  }

});
