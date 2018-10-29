import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',
  classNames: ['ListMenu-item'],

  click(e) {
    e.preventDefault();
    if (this.onClick) {
      this.onClick();
    }
  }
});
