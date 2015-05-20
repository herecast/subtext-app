import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  typeForRoot() {
    return 'similarContent';
  }
});
