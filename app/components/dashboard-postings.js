import Ember from 'ember';

const {
  computed,
  computed: {empty, match, equal},
  get, set,
  inject,
  on
} = Ember;

function sortBy(sort) {
  return computed('postings.[]', function() {
    return sort;
  });
}

export default Ember.Component.extend({
  postings: null,
  ads: null,

  notify: inject.service('notification-messages'),
  descriptionParam: sortBy('description ASC'),
  nameParam: sortBy('title ASC'),
  typeParam: sortBy('channel_type ASC, pubdate DESC'),
  dateParam: computed('postings.[]', 'type', function() {
    const sort = get(this, 'type') === 'promotion-banner' ? 'start_date' : 'pubdate';
    return sort + ' DESC';
  }),
  viewsParam: sortBy('view_count DESC'),
  commentsParam: sortBy('comment_count DESC'),
  clicksParam: sortBy('click_count DESC'),
  impressionsParam: sortBy('impression_count DESC'),

  sortedByDescription: match('sort', /^description/),
  sortedByName: match('sort', /^title/),
  sortedByType: match('sort', /^channel_type/),
  sortedByDate: match('sort', /^pubdate|start_date/),
  sortedByViews: match('sort', /^view_count/),
  sortedByComments: match('sort', /^comment_count/),
  sortedByClicks: match('sort', /^click_count/),
  sortedByImpressions: match('sort', /^impression_count/),

  typeIsEverything: empty('type'),
  typeIsNews: equal('type','news'),
  typeIsEvents: equal('type','events'),
  typeIsComment: equal('type','comment'),
  typeIsTalk: equal('type','talk'),
  typeIsMarket: equal('type','market'),
  typeIsAds: equal('type','promotion-banner'),

  detectDisplayDashboardSetting: on('init', function() {
    if('localStorage' in window) {
      const dismissed = localStorage.getItem('dismissed-dashboard-info-tip');
      set(this, 'displayDashboardTip',
        Ember.isNone(dismissed)
      );
    }
  }),

  sortDirection: computed('sort', function(){
    const sort = get(this, 'sort') || '';
    const matches = sort.match(/^[a-z_-]+\s{1}(ASC|DESC)/i) || [];

    return (matches[0] || '').split(/\s/)[1];
  }),

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
    },
    reverseSort() {
      const sort = get(this, 'sort');
      const sortDirection = get(this, 'sortDirection');
      const newSort = sort.replace(sortDirection, (sortDirection === "ASC" ? "DESC" : "ASC"));

      this.sendAction('sortBy',newSort);
    },
    sortBy(newSort) {
      const currentSort = get(this, "sort");
      if(newSort === currentSort) {
        this.send('reverseSort');
      } else {
        this.sendAction('sortBy', newSort);
      }
    },
    deleteContent(record) {
      const notify = get(this, 'notify');
      const postings = get(this, 'postings');

      if (confirm('Are you sure you want to permanently delete this post?')) {
        record.destroyRecord().then((record) => {
          postings.removeObject(record);
          notify.success('Post deleted');
        });
      }
    },

    closeDashboardTip() {
      localStorage.setItem('dismissed-dahsboard-info-tip', true);
      set(this, 'displayDashboardTip', false);
    }
  }
});
