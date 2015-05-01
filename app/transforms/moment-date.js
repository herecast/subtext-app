import DS from 'ember-data';
import moment from 'moment';

export default DS.DateTransform.extend({
  deserialize: function(serialized) {
    return moment(this._super(serialized));
  },

  serialize: function(deserialized) {
    return this._super(deserialized.toDate());
  }
});
