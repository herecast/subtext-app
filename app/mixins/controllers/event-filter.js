import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['category', 'startDate', 'stopDate', 'location', 'r'],

  category: 'everything',
  startDate: null,
  stopDate: null,
  location: '',
  r: false
});
