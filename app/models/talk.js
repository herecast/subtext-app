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
  parentContentType: DS.attr('string'),
  parentEventInstanceId: DS.attr('number'),
  publishedAt: DS.attr('moment-date', {defaultValue: moment()}),
  title: DS.attr('string'),
  viewCount: DS.attr('number'),

  listEnabled: Ember.computed.notEmpty('listservId'),

  hasParentContent: function() {
    return Ember.isPresent(this.get('parentContentType')) && Ember.isPresent(this.get('parentContentId'));
  }.property('parentContentType', 'parentContentId'),

  parentContentRoute: function() {
    const parentContentType = this.get('parentContentType');
    if (parentContentType === 'market_post') {
      return 'market.show';
    } else if (parentContentType === 'event') {
      return 'events.show';
    } else if (parentContentType === 'talk_of_the_town') {
      return 'talk.show';
    } else {
      return `${parentContentType}.show`;
    }
  }.property('parentContentType'),

  commentCountText: function() {
    const count = this.get('commentCount');

    if (count === 1) {
      return 'post';
    } else {
      return 'posts';
    }
  }.property('commentCount'),

  viewCountText: function() {
    const count = this.get('viewCount');

    if (count === 1) {
      return 'view';
    } else {
      return 'views';
    }
  }.property('viewCount'),

  commentAnchor: function() {
    return `comment-${this.get('id')}`;
  }.property('talk.id'),

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
