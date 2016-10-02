import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/controllers/paginated-filter';

const {
  computed,
  get,
  set,
  isPresent,
  isBlank
} = Ember;

export default Ember.Controller.extend(PaginatedFilter, {
  queryParams: ['query', 'page', 'per_page'],
  page: 1,
  per_page: 8,
  query: "",
  totalCount: computed.oneWay('news.content.meta.total'),

  showNextPage: computed('totalCount', 'per_page', 'page', function() {
    return get(this, 'totalCount') >= (get(this, 'per_page') * get(this, 'page'));
  }),

  news: computed('model.id', 'page', 'per_page', 'query', function() {
    const organizationId = get(this, 'model.id');
    const page = get(this, 'page');
    const perPage = get(this, 'per_page');
    const query = get(this, 'query');

    return this.store.query('news', {
      organization_id: organizationId,
      page: page,
      per_page: perPage,
      query: query
    });
  }),

  /**
   * We show the large card if there is no query and we're on the first page of results.
   */
  showLargeCard: computed('query', 'page', function() {
    const query = get(this, 'query');
    const page = get(this, 'page');

    return page === 1 && isBlank(query);
  }),

  /**
   * List of news items which may exclude the first news item
   * if a query is not present and we're on the first page
   */
  newsList: computed('news.@each.id', 'showLargeCard', function() {
    const showLargeCard = get(this, 'showLargeCard');
    const news = get(this, 'news');

    return showLargeCard ? news.slice(1) : news;
  }),

  /**
   * Remaining list of news items
   * - Excludes first item from original results if large card is present (no query, on first page)
   *    -- use `news.firstObject` in template to display the large card
   * - Excludes next item from original results if ad is present
   *    -- use `newsList.firstObject` in template for news-card adjacent to ad
   *    -- then, iterate over `newsListRemainingItems` to display rest of cards
   * - If large card not present AND no ad is present, should list all cards
   */
  newsListRemainingItems: computed('newsList.@each.id', 'model.profileAdOverride.id', function() {
    const profileAdOverrideId = get(this, 'model.profileAdOverride.id');
    const newsList = get(this, 'newsList');

    return isPresent(profileAdOverrideId) ? newsList.slice(1) : newsList;
  }),

  headerStyle: computed('model.backgroundImageUrl', function() {
    const backgroundImageUrl = get(this, 'model.backgroundImageUrl') || '/images/profile-default-background.png';

    return Ember.String.htmlSafe(`background-image: url('${backgroundImageUrl}');`);
  }),

  hasBackgroundImage: computed.notEmpty('model.backgroundImageUrl'),

  actions: {
    updateQuery(q) {
      if(q.length > 2) {
        set(this, 'query', q);
      } else {
        set(this, 'query', "");
      }
      set(this, 'page', 1);
    },

    editProfile() {
      set(this, 'editMode', true);
    },

    cancelEdit() {
      if(get(this, 'model.hasDirtyAttributes') || get(this, 'model.hasNewImage')) {
        if(confirm('You have unsaved changes. Cancel editing?')) {
          const model = get(this, 'model');
          model.rollbackAttributes();
          model.clearNewImages();
          set(this, 'editMode', false);
        }
      } else {
        set(this, 'editMode', false);
      }
    },

    closeModal() {
      set(this, 'editMode', false);
    }
  }
});
