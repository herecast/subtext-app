import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),
  parentContentId: DS.attr('number'),
  title: DS.attr('string'),
  userName: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  pubdate: DS.attr('moment-date'),

  formattedPostedAt: function() {
    return this.get('pubdate').fromNow();
  }.property('pubdate')
});
