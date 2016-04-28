import Ember from 'ember';

const { get, run } = Ember;

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['SearchInput'],
  debounceWait: 900,
  value: null,
  placeholder: 'Search ...',

  _updateAction(value) {
    this.attrs.update(value);
  },

  actions: {
    update(val) {
      const debounceWait = get(this, 'debounceWait');
      run.debounce(this, this._updateAction, val,  debounceWait);
    }
  }
});
