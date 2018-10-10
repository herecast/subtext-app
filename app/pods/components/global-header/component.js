/* global window */
import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const {
  get,
  inject:{service},
  run,
  computed
} = Ember;

export default Ember.Component.extend(TestSelector, {
  classNames: ['GlobalHeader'],
  classNameBindings: ['showSearch:search-open', 'isScrollingDown:hide-header:show-header'],

  currentController: service(),
  routing: service('-routing'),

  searchService: service('search'),
  showSearch: computed.alias('searchService.searchActive'),
  activeFilter: computed.readOnly('searchService.activeFilter'),

  scrollDirection: service(),
  isWithinHeaderFromTopOfPage: computed.lt('scrollDirection.currentScrollPosition', 40),
  isScrollingDown: computed('scrollDirection.isScrollingDown', 'showSearch', 'hideUserLocationBar', 'isWithinHeaderFromTopOfPage', function() {
    if (get(this, 'showSearch') || get(this, 'hideUserLocationBar') || get(this, 'isWithinHeaderFromTopOfPage')) {
      return false;
    }

    return get(this, 'scrollDirection.isScrollingDown');
  }),

  hideUserLocationBar: computed.not('showUserLocationBar'),

  actions: {
    toggleSearch(focusTarget) {
      const searchService = get(this, 'searchService');

      if (get(searchService, 'searchActive')) {
        if (get(searchService, 'query').length) {
          searchService.clearSearch();
        }
      } else {
        run.next(() => {
          if (focusTarget === 'focusOnLocation') {
            this.$('.UserLocation-SearchInput input').focus();
          } else {
            this.$('.GlobalHeader-querySearch input').focus();
          }
        });
      }

      searchService.toggleProperty('searchActive');
    },

    logoClicked() {
      Ember.$(window).scrollTop(0);

      const router = get(this, 'routing.router');

      if (get(router, 'currentRouteName') !== 'feed.index') {
        router.transitionTo('feed.index');
      }
    },

    updateSearchQuery(query) {
      get(this, 'searchService').performSearch(query);
    },

    onRemoveFilter() {
      get(this, 'routing.router').transitionTo('feed.index', {
        queryParams: {
          type: ''
        }
      });
    }
  }
});
