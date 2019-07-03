import { get } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  model: null,
  openOrangeButton: function() {},

  actions: {
    openOrangeButton() {
      get(this, 'openOrangeButton')();
    }
  }
});
