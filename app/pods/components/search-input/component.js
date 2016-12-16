import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, run } = Ember;

export default Ember.Component.extend(TestSelector, {
  tagName: 'span',
  classNames: ['SearchInput'],
  debounceWait: 900,
  value: null,
  placeholder: 'Search ...',
  clearTooltip: 'Clear Search',
  showIcon: true,
  inputType: 'search',
  clearButtonText: null,

  keyUp: function(e) {
    const esc = 27;
    if(e.which === esc) {
      this._updateAction("");
    }
  },

  _updateAction(value) {
    if('update' in this.attrs) {
      this.attrs.update(value);
    }
  },

  actions: {
    update(val) {
      const debounceWait = get(this, 'debounceWait');
      run.debounce(this, this._updateAction, val,  debounceWait);
    }
  }
});
