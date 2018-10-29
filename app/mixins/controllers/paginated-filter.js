import { gt } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  showPrevPage: gt('page', 1),

  showNextPage: computed('model.[]', 'page', function() {
    return this.get('model.length') === this.get('per_page');
  })
});
