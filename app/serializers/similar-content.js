import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  primaryKey: 'content_id',

  typeForRoot() {
    return 'similarContent';
  }
});
