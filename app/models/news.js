import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { computed } = Ember;

export default DS.Model.extend({
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  content: DS.attr('string'),

  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  commentCount: DS.attr('number'),
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  images: DS.attr('raw', {defaultValue: function(){ return [];}}),
  organizationId: DS.attr('number'),
  organizationName: DS.attr('string'),
  publishedAt: DS.attr('moment-date'),

  formattedPublishedAt: computed('publishedAt', function() {
    return moment(this.get('publishedAt')).format('dddd, MMMM D, YYYY');
  }),

  bannerImage: computed('images', function() {
    return this.get('images.firstObject');
  })
});
