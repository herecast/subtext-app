import Ember from 'ember';

const { get, set, isPresent } = Ember;

export default Ember.Route.extend({
  error: null,

  model(params) {
    return this.store.findRecord('listserv-content', params.id);
  },

  afterModel(model) {
    set(this, 'error', null);

    if(isPresent(model.get('verifiedAt'))) {
      set(this, 'error',
        "You have already verified your post. Thank you."
      );
      return;
    }
  },

  setupController(controller) {
    this._super(...arguments);

    controller.set('error', get(this, 'error'));
  }

});
