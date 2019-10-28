import { computed, get } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  queryParams: DS.attr(), //should be object to be reduced &key0=value0&key1=value1 etc string for url
  carouselType: DS.attr('string'),

  contents: DS.hasMany('content', {async: false}),

  isContentCarousel: computed('carouselType', function() {
    return get(this, 'carouselType').dasherize() === 'content';
  })
});
