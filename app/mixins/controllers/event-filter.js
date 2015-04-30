import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['category', 'startDate', 'stopDate', 'location'],

  category: 'everything',
  startDate: null,
  stopDate: null,
  location: ''
});
