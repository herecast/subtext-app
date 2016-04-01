import Ember from 'ember';

const { inject, get } = Ember;

export default Ember.Mixin.create({
  api: inject.service('api'),

  setupController(controller, model) {
    this._super(controller, model);

    const api = get(this, 'api');

    api.getListServs().then((response) => {
      controller.set('listservs', response.listservs);
    });
  }
});
