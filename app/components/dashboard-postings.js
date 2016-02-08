import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

const {
  computed,
  computed: {equal, empty},
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
  clicksParam: sortBy('click_count DESC'),
  impressionsParam: sortBy('impression_count DESC'),

  sortedByName: equal('sort', 'title ASC'),
  sortedByType: equal('sort', 'channel_type ASC, pubdate DESC'),
  sortedByDate: equal('sort', 'pubdate DESC'),
  sortedByViews: equal('sort', 'view_count DESC'),
  sortedByComments: equal('sort', 'comment_count DESC'),
  sortedByClicks: equal('sort', 'click_count DESC'),
  sortedByImpressions: equal('sort', 'impression_count DESC'),

  content: computed('type', 'postings.[]', 'postings.isPending', 'ads.[]', 'ads.isPending', function() {
    if(get(this, 'type') === 'promotion-banner') {
      return get(this, 'ads');
    } else {
      return get(this, 'postings'); 
    }
  }),

  showPrevPage: computed.gt('page', 1),
  showNextPage: computed('content.[]', 'per_page', function() {
    let per = get(this, 'per_page') || 8;
    let postingsCount = get(this, 'content.length');
    return postingsCount >= per;
  }),

  isLoading: computed.alias('content.isPending'),
  mobileTabsVisible: false,

  showTypeColumn: empty('type'),

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
      set(this, 'page', 1);
    },
    toggleMobileTabs: function() {
      this.toggleProperty('mobileTabsVisible');
    }
  }
});
