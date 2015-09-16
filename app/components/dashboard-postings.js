import Ember from 'ember';

const equal = Ember.computed.equal;

function sortBy(sort) {
  return Ember.computed('postings.[]', function() {
    return sort;
  });
}

export default Ember.Component.extend({
  nameParam: sortBy('title ASC'),
  typeParam: sortBy('channel_type ASC, pubdate DESC'),
  dateParam: sortBy('pubdate DESC'),
  viewsParam: sortBy('view_count DESC'),
  commentsParam: sortBy('comment_count DESC'),

  sortedByName: equal('sort', 'title ASC'),
  sortedByType: equal('sort', 'channel_type ASC, pubdate DESC'),
  sortedByDate: equal('sort', 'pubdate DESC'),
  sortedByViews: equal('sort', 'view_count DESC'),
  sortedByComments: equal('sort', 'comment_count DESC'),

  scrollToPostings: function() {
    if (Ember.isPresent(this.get('sort'))) {
      Ember.$('body').scrollTop(this.$().offset().top);
    }
  }.on('didInsertElement')
});
