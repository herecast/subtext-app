import Ember from 'ember';

export default Ember.Mixin.create({
  initScrollPositioning: function() {
    const cardPreview = Ember.$('.ContentCardPreview-content');
    cardPreview.affix({
      offset: {
        top: cardPreview.offset().top - 20
      }
    });
  }.on('didInsertElement')
});
