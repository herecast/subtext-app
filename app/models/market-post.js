import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default DS.Model.extend({
  canEdit: DS.attr('boolean'),
  contactEmail: DS.attr('string'),
  contactPhone: DS.attr('string'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  extendedReachEnabled: DS.attr('boolean', {defaultValue: false}),
  hasContactInfo: DS.attr('boolean'),
  imageUrl: DS.attr('string'),
  listservIds: DS.attr('raw', {defaultValue: []}),
  price: DS.attr('string'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  title: DS.attr('string'),

  listsEnabled: Ember.computed.notEmpty('listservIds'),

  formattedPublishedAt: function() {
    return this.get('publishedAt').format('dddd, MMMM D, YYYY');
  }.property('publishedAt'),

  uploadImage() {
    const url = `/${config.API_NAMESPACE}/market_posts/${this.get('id')}`;
    const data = new FormData();

    if (this.get('image')) {
      data.append('market_post[image]', this.get('image'));

      return ajax(url, {
        data: data,
        type: 'PUT',
        contentType: false,
        processData: false
      });
    }
  }
});
