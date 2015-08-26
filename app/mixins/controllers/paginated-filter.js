import Ember from 'ember';

export default Ember.Mixin.create({
  showPrevPage: Ember.computed.gt('page', 1),

  showNextPage: function() {
    return this.get('model.length') === this.get('per_page');
  }.property('model.[]', 'page')
});
