import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

const { computed, get, inject } = Ember;

export default DS.Model.extend({
  api: inject.service('api'),
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
  organization: DS.belongsTo('organization'),

  listEnabled: Ember.computed.notEmpty('listservId'),

  hasParentContent: computed('parentContentType', 'parentContentId', function() {
    return Ember.isPresent(this.get('parentContentType')) && Ember.isPresent(this.get('parentContentId'));
  }),

  parentContentRoute: computed('parentContentType', function() {
    const parentContentType = this.get('parentContentType');
    if (parentContentType === 'market-post') {
      return 'market.show';
    } else if (parentContentType === 'event' || parentContentType === 'event_instance' || parentContentType === 'event-instance') {
      return 'events.show';
    } else if (parentContentType === 'talk_of_the_town') {
      return 'talk.show';
    } else {
      return `${parentContentType}.show`;
    }
  }),

  commentCountText: computed('commentCount', function() {
    const count = this.get('commentCount');

    if (count === 1) {
      return 'post';
    } else {
      return 'posts';
    }
  }),

  viewCountText:computed('viewCount',  function() {
    const count = this.get('viewCount');

    if (count === 1) {
      return 'view';
    } else {
      return 'views';
    }
  }),

  commentAnchor: computed('talk.id', function() {
    return `comment-${this.get('id')}`;
  }),

  uploadImage() {
    if (this.get('image')) {
      const api = get(this, 'api');
      const talk_id = get(this, 'id');
      const data = new FormData();

      data.append('talk[image]', this.get('image'));

      return api.updateTalkImage(talk_id, data);
    }
  }
});
