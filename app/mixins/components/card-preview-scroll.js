import Ember from 'ember';

const { on } = Ember;

export default Ember.Mixin.create({
  initScrollPositioning: on('didInsertElement', function() {
    const cardPreview = Ember.$('.ContentCardPreview-content');
    cardPreview.affix({
      offset: {
        top: cardPreview.offset().top - 20,
        bottom: 253
      }
    });
  })
});
