import Ember from 'ember';
import ajax from 'ic-ajax';
import DS from 'ember-data';
import config from '../config/environment';
import moment from 'moment';

export default DS.Model.extend({
  authorName: DS.attr('string'),
  authorImageUrl: DS.attr('string'),
  commentCount: DS.attr('number'),
  commenterCount: DS.attr('number'),
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  imageUrl: DS.attr('string'),
  listservId: DS.attr('number'), // write only
  parentContentId: DS.attr('number'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  title: DS.attr('string'),
  viewCount: DS.attr('number'),

  listEnabled: Ember.computed.notEmpty('listservId'),

  uploadImage() {
    const url = `/${config.API_NAMESPACE}/talk/${this.get('id')}`;
    const data = new FormData();

    if (this.get('image')) {
      data.append('talk[image]', this.get('image'));

      return ajax(url, {
        data: data,
        type: 'PUT',
        contentType: false,
        processData: false
      });
    }
  }
});
