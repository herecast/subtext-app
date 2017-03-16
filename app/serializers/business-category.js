// import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  isNewSerializerAPI: true,
  normalize(typeClass, hash, prop) {
    hash.original_parent_ids = hash.parent_ids;
    hash.original_child_ids = hash.child_ids;

    return this._super(typeClass, hash, prop);
  }
});
