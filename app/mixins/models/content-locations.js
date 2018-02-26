import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
  promoteRadius: DS.attr('number'),

  // Used in UGC process to set the base promotion location
  location: DS.belongsTo('location'),

  // Used for special display in listserv cards
  baseLocations: DS.hasMany('location')
});
