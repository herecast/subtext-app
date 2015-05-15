import DS from 'ember-data';
import moment from 'moment';

export default DS.DateTransform.extend({
  deserialize: function(serialized) {
    return moment(this._super(serialized));
  },

  serialize: function(deserialized) {
    if (moment(deserialized).isValid()) {
      deserialized = moment(deserialized).toDate();
    } else {
      deserialized = null;
    }

    return this._super(deserialized);
  }
});
