import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['data-test-content-grid'],
  'data-test-content-grid': true,
  classNames: ['ContentGrid']
});
