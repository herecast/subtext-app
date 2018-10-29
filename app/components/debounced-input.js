import { debounce } from '@ember/runloop';
import TextField from '@ember/component/text-field';
import { set, get } from '@ember/object';

export default TextField.extend({
  debounceWait: 500, // default wait value
  fireAtStart: false, // defaults to “start at start of wait period”
  _elementValueDidChange: function() {
    debounce(this, this._setValue, this.debounceWait, this.fireAtStart);
  },
  _setValue: function () {
    if(!get(this, 'isDestroying')) {
      set(this,'value', this.$().val());
    }
  }
});
