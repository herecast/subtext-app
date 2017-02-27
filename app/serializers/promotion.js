import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  primaryKey: 'promotion_id',

  payloadKeyFromModelName() {
    return 'promotion';
  },

  normalize(model, hash, prop) {
    if (prop === 'promotions') {
      hash.metrics_id = hash.id;
    }
    return this._super(...arguments);
  }


});
