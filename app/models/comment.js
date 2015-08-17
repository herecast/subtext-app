import DS from 'ember-data';

export default DS.Model.extend({
  parentComment: DS.belongsTo('comment'),
  content: DS.attr('string'),
  eventInstanceId: DS.attr('number'),
  title: DS.attr('string'),
  userName: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  postedAt: DS.attr('moment-date'),

  formattedPostedAt: function() {
    return this.get('postedAt').fromNow();
  }.property('postedAt')
});
