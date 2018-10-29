import Controller from '@ember/controller';
import { computed, get } from '@ember/object';

export default Controller.extend({
  queryParams: ['page'],
  page: 1,

  hasResults: computed('model.[]', function() {
    return get(this, 'model.length');
  })
});
