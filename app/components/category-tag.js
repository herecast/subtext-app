import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['CategoryTag u-layoutPadB5 u-layoutPadT5'],
  removable: null,
  actions: {
    selectTag() {
      this.attrs.selectTag(...arguments);
    }
  }
});
