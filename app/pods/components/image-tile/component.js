import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['isPrimary:is-primary'],
  classNames: ['ImageTile']
});
