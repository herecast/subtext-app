import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['ListMenu-item'],

  click(e) {
    e.preventDefault();
    if (this.onClick) {
      this.onClick();
    }
  }
});
