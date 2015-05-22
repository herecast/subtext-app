import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['DisabledCheckbox'],
  classNameBindings: ['checked:is-checked']
});
