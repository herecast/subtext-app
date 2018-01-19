import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNames: ['FeedPagination'],
  // This is not meant to be seen by users.  Only bots
  style: "display:none;",
  page: 1,
  totalPages: 1,

  prevPage: computed('page', function() {
    return (get(this, 'page') || 1) - 1;
  }),

  showPrevPage: computed.gt('page', 1),

  nextPage: computed('page', function() {
    return (get(this, 'page') || 1) + 1;
  }),

  showNextPage: computed('page', 'totalPages', function() {
    return (get(this, 'totalPages') || 1) > (get(this, 'page') || 1);
  })
});
