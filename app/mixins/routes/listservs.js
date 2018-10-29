import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({
  api: service('api'),

  setupController(controller, model) {
    this._super(controller, model);

    const api = get(this, 'api');

    api.getListServs().then((response) => {
      controller.set('listservs', response.listservs);
    });
  }
});
