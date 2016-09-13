import DS from 'ember-data';
import Ember from 'ember';

const { get, computed } = Ember;

export default DS.Model.extend({
  subject: DS.attr('string'),
  body: DS.attr('string'),
  senderEmail: DS.attr('string'),
  senderName: DS.attr('string'),
  verifiedAt: DS.attr('moment-date'),
  liveDate: DS.attr('moment-date'),

  userId: DS.attr('number'),
  channelType: DS.attr('string'),
  contentId: DS.attr('number'),

  listserv: DS.belongsTo('listserv', { async: true }),

  // Used for temporary storage
  enhancedPost: null,

  isMarket: computed('channelType', function() {
    return get(this, 'channelType') === 'market';
  }),

  isEvent: computed('channelType', function() {
    return get(this, 'channelType') === 'event';
  }),

  isTalk: computed('channelType', function() {
    return get(this, 'channelType') === 'talk';
  })
});
