import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  actions: {
    closePreview() {
      get(this, 'closePreview')();
    }
  }
});
