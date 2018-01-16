import DS from 'ember-data';
import Ember from 'ember';

const { get, computed } = Ember;

export default DS.Model.extend({
  title: DS.attr('string'),
  queryParams: DS.attr(), //should be object to be reduced &key0=value0&key1=value1 etc string for url
  carouselType: DS.attr('string'),

  organizations: DS.hasMany('organization', {async: false}),
  feedContents: DS.hasMany('feed-content', {async: false}),

  isOrganizationCarousel: computed.equal('carouselType', 'organization'),
  isFeedContentCarousel: computed('carouselType', function() {
    return get(this, 'carouselType').dasherize() === 'feed-content';
  })
});
