import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { get, run } = Ember;

export default Ember.Component.extend(TestSelector, {
  tagName: 'span',
  classNames: ['SearchInput'],
  classNameBindings: [
    'noBorder:SearchInput-noBorder'
  ],
  debounceWait: 900,
  value: null,
  placeholder: 'Search ...',
  clearTooltip: 'Clear Search',
  showIcon: true,
  inputType: 'search',
  clearButtonText: null,

  noBorder: false,

  keyUp: function(e) {
    const esc = 27;
    const enter = 13;

    if(e.which === esc) {
      this._updateAction("");
    } else if(e.which === enter) {
      // unfocus so the mobile keyboard will hide.
      Ember.$(e.target).blur();
    }
  },

  _updateAction(value) {
    const update = get(this, 'update');
    if (update) {
      update(value);
    }
  },

  actions: {
    update(val) {
      if (val === "") {
        const clearSearchType = get(this, 'clearSearchType');
        if (clearSearchType) {
          clearSearchType();
        }
      }
      const debounceWait = get(this, 'debounceWait');
      run.debounce(this, this._updateAction, val,  debounceWait);
    }
  }
});
