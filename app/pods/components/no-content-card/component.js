import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  "data-test-component": 'no-content-card',
  floatingActionButton: service(),

  actions: {
    showJobsTray() {
      get(this, 'floatingActionButton').expand();
    }
  }
});
