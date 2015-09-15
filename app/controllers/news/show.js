import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['scrollTo'],
  scrollTo: null,

  hasCaptionOrCredit: function() {
    return Ember.isPresent(this.get('model.bannerImage.caption')) ||
      Ember.isPresent(this.get('model.bannerImage.credit'));
  }.property('model.bannerImage.{caption,credit}')
});
