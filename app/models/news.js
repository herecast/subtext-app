import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { computed } = Ember;

export default DS.Model.extend({
  adminContentUrl: DS.attr('string'),
  authorId: DS.attr('number'),
  authorName: DS.attr('string'),
  commentCount: DS.attr('number'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  images: DS.attr('raw', {defaultValue: function(){ return [];}}),
  organizationId: DS.attr('number'),
  organizationName: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: function() {return moment();}}),
  subtitle: DS.attr('string'),
  title: DS.attr('string'),

  formattedPublishedAt: computed('publishedAt', function() {
    return moment(this.get('publishedAt')).format('dddd, MMMM D, YYYY');
  }),

  bannerImage: computed('images', function() {
    return this.get('images.firstObject');
  })
});
