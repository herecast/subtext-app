import Ember from 'ember';

const { get, run } = Ember;

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['SearchInput'],
  debounceWait: 200,
  value: null,
  placeholder: 'Search ...',

  input() {
    const value = this.$('input').val();
    const debounceWait = get(this, 'debounceWait');

    run.debounce(this._updateAction, value, debounceWait);
  },

  _updateAction() {
    this.attrs.action(get(this, value));
  }
});
