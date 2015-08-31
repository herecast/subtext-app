import Ember from 'ember';
import Redirect from '../../mixins/routes/redirect-after-login';

export default Ember.Route.extend(Redirect, {
  promotion: Ember.inject.service('promotion'),

  model(params)  {
    return this.store.findRecord('market-post', params.id, { reload: true });
  },

  setupController(controller, model) {
    this._super(controller, model);

    this.get('promotion').find(model.get('contentId')).then((promotion) => {
      controller.set('relatedPromotion', promotion);
    });
  }
});
