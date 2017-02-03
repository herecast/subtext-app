import Ember from 'ember';

const { get, set } = Ember;

export default Ember.TextField.extend({
  debounceWait: 500, // default wait value
  fireAtStart: false, // defaults to “start at start of wait period”
  _elementValueDidChange: function() {
    Ember.run.debounce(this, this._setValue, this.debounceWait, this.fireAtStart);
  },
  _setValue: function () {
    if(!get(this, 'isDestroying')) {
      set(this,'value', this.$().val());
    }
  }
});
