import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  model: null,

  sold: alias('model.sold'),

  actions: {
    toggleSold() {
      this.toggleProperty('sold');
    }
  }
});
