import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';
import Mixin from '@ember/object/mixin';


export default Mixin.create({
  _modalPathOverride: null,
  _modalParentPath: null,

  routing: service('-routing'),
  router: service(),

  renderTemplate() {
    this.render({
      into: 'application',
      outlet: 'modal-outlet'
    });
  },

  _calculateModelParams(model) {
    let modelParams = {
      id: get(model, 'id'),
    };

    const eventInstanceId = get(model, 'eventInstanceId') || false;

    if (eventInstanceId) {
      modelParams.event_instance_id = eventInstanceId;
    }

    return modelParams;
  },

  afterModel(model, transition) {
    this._super(...arguments);

    const modalPathOverride = get(this, '_modalPathOverride') || false;

    if (modalPathOverride) {
      const modelParams = this._calculateModelParams(model);
      const url = get(this, 'router').urlFor(modalPathOverride, modelParams);

      this.enter();
      this.setup(model, transition);
      getOwner(this).lookup('route:application').connections = getOwner(this).lookup('route:application').connections.concat(this.connections);
      transition.abort();
      transition.router.updateURL(url);
    }
  }
});
