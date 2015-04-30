import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['category', 'startDate', 'stopDate'],

  category: 'everything',
  startDate: null,
  stopDate: null
});
