import Ember from 'ember';

const { get, set, inject, isPresent } = Ember;

export default Ember.Route.extend({
  fastboot: inject.service(),
  api: inject.service(),
  features: inject.service('feature-flags'),
  error: null,

  model(params) {
    return this.store.findRecord('listserv-content', params.id);
  },

  afterModel(model) {
    const shoebox = get(this, 'fastboot.shoebox');


    if(!shoebox.get('skipProcessingAction')) {
      const api = get(this, 'api');

      set(this, 'error', null);

      if(isPresent(model.get('verifiedAt'))) {
        set(this, 'error',
          "You have already verified your post. Thank you."
        );
        return;
      }

      get(this, 'api').confirmListservPost(model.id);

      api.updateListservProgress(get(model, 'id'), {
        'enhance_link_clicked': false,
        'step_reached': 'verify_post'
      });

      if(get(this, 'fastboot.isFastBoot')) {
        shoebox.put('skipProcessingAction', true);
      }
    }
  },

  setupController(controller) {
    this._super(...arguments);

    controller.set('error', get(this, 'error'));
  }

});
