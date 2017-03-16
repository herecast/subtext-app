import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['CategoryTag u-layoutPadB5 u-layoutPadT5'],
  removable: null,
  actions: {
    selectTag() {
      const selectTag = get(this, 'selectTag');
      if (selectTag) {
        selectTag(...arguments);
      }
    }
  }
});
