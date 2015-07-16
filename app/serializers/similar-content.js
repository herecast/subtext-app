import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  primaryKey: 'content_id',

  typeForRoot() {
    return 'similarContent';
  }
});
