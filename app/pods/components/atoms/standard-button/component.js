import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  attrributeBindings: ['disabled'],
  classNames: ['Button'],
  classNameBindings: ['primary:Button--primary'],

  click() {
    this.get('action')();
    return false;
  }
});
