import { setProperties } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    setProperties(this, {
      organization: null,
      customLinks: []
    });
  }
});
