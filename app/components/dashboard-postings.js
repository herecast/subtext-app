import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  computed,
  computed: {equal},
  get,
  set
} = Ember;

function sortBy(sort) {
  return computed('postings.[]', function() {
    return sort;
  });
}

export default Ember.Component.extend(TrackEvent, {
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

  showPrevPage: computed.gt('page',1),
  showNextPage: computed('postings.[]','per_page', function() {
    let per = get(this,'per_page') || 8;
    let postingsCount = get(this,'postings.length');
    return postingsCount >= per;
  }),

  isLoading: computed.alias('postings.isPending'),
  mobileTabsVisible: false,

  _getTrackingArguments(sortBy) {
    return {
      navControlGroup: 'Dashboard Controls',
      navControl: `Sort ${sortBy}`
    };
  },

  actions: {
    nextPage: function() {
      this.incrementProperty('page');
    },
    prevPage: function() {
      this.decrementProperty('page');
    },
    firstPage: function(){
      set(this,'page',1);
    },
    toggleMobileTabs: function() {
      this.toggleProperty('mobileTabsVisible');
    }
  }
});
