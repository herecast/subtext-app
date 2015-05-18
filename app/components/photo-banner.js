import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['PhotoBanner'],
  attributeBindings: ['style'],

  style: function() {
    const bannerUrl = this.get('bannerUrl');

    return `background-image: url('${bannerUrl}')`.htmlSafe();
  }.property('bannerUrl')

});