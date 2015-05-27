import DS from 'ember-data';
import moment from 'moment';

export default DS.DateTransform.extend({
  deserialize: function(serialized) {
    // Sometimes the date will be null and we don't want to try to convert
    // it to a date.
    if (serialized) {
      return moment(this._super(serialized));
    } else {
      return serialized;
    }
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
