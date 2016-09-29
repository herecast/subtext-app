import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  primaryKey: 'promotion_id',

  payloadKeyFromModelName() {
    return 'promotion';
  }

});
