import Ember from 'ember';

const { computed } = Ember;

export default Ember.Mixin.create({
  showPrevPage: Ember.computed.gt('page', 1),

  showNextPage: computed('model.[]', 'page', function() {
    return this.get('model.length') === this.get('per_page');
  })
});
