import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  attributeBindings: ['style'],
  classNames: ['FeedPagination'],
  // This is not meant to be seen by users.  Only bots
  style: htmlSafe("display:none;"),
  page: 1,
  totalPages: 1,

  prevPage: computed('page', function() {
    return (get(this, 'page') || 1) - 1;
  }),

  showPrevPage: gt('page', 1),

  nextPage: computed('page', function() {
    return (get(this, 'page') || 1) + 1;
  }),

  showNextPage: computed('page', 'totalPages', function() {
    return (get(this, 'totalPages') || 1) > (get(this, 'page') || 1);
  })
});
