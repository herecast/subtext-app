import Ember from 'ember';

const { computed } = Ember;

export default Ember.Controller.extend({
  queryParams: ['scrollTo'],
  scrollTo: null,

  hasCaptionOrCredit: computed('model.bannerImage.{caption,credit}', function() {
    return Ember.isPresent(this.get('model.bannerImage.caption')) ||
      Ember.isPresent(this.get('model.bannerImage.credit'));
  })
});
