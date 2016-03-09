import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalize(typeClass, hash, prop) {
    hash.original_parent_ids = hash.parent_ids;
    hash.original_child_ids = hash.child_ids;

    return this._super(typeClass, hash, prop);
  }
});
