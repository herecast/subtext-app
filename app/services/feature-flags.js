import Ember from 'ember';

const {
  inject,
  get,
  set
} = Ember;

export default Ember.Service.extend({
  api: inject.service(),

  init() {
    this._super(...arguments);

    get(this, 'api').getFeatures().then(({features}) => {
      return features.forEach((feature) => {
        set(this, feature.name, true);
      });
    });
  }
});
