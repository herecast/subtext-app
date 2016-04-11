import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default DS.Model.extend({
  content: DS.attr('string'),
  contentId: DS.attr('number'),
  parentContentId: DS.attr('number'),
  title: DS.attr('string'),
  userName: DS.attr('string'),
  userImageUrl: DS.attr('string'),
  pubdate: DS.attr('moment-date'),

  formattedPostedAt: computed('pubdate', function() {
    return this.get('pubdate').fromNow();
  })
});
