/* global window */
import { alias, readOnly, not, and } from '@ember/object/computed';
import $ from 'jquery';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { computed, get } from '@ember/object';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Component.extend(TestSelector, {
  classNames: ['GlobalHeader'],
  classNameBindings: ['showSearch:search-open', 'isScrollingDown:hide-header:show-header'],

  currentController: service(),
  router: service(),
  fastboot: service(),

  searchService: service('search'),
  showSearch: alias('searchService.searchActive'),
  activeFilter: readOnly('searchService.activeFilter'),
  filtersAreActive: readOnly('searchService.filtersAreActive'),

  scrollDirection: service(),
  isWithinHeaderFromTopOfPage: computed.lt('scrollDirection.currentScrollPosition', 40),
  isScrollingDown: computed('scrollDirection.isScrollingDown', 'showSearch', 'hideUserLocationBar', 'isWithinHeaderFromTopOfPage', function() {
    if (get(this, 'showSearch') || get(this, 'hideUserLocationBar') || get(this, 'isWithinHeaderFromTopOfPage')) {
      return false;
    }

    return get(this, 'scrollDirection.isScrollingDown');
  }),
  isScrollingUp: not('isScrollingDown'),

  showFilterButton: and('filtersAreActive', 'isScrollingDown'),
  showFilterBar: not('hideUserLocationBar'),

  hideUserLocationBar: computed('showUserLocationBar', 'fastboot.isFastBoot', function() {
    return !get(this, 'showUserLocationBar') || get(this, 'fastboot.isFastBoot');
  }),

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

    scrollUpOne() {
      $('html,body').animate({
        scrollTop: $(window).scrollTop() - 1
      });
    },

    logoClicked() {
      $(window).scrollTop(0);

      const router = get(this, 'router');

      if (get(router, 'currentRouteName') !== 'feed.index') {
        router.transitionTo('feed.index');
      }
    },

    updateSearchQuery(query) {
      get(this, 'searchService').performSearch(query);
    },

    onRemoveFilter() {
      const transition = get(this, 'router').transitionTo('feed.index', {
        queryParams: {
          type: null
        }
      });

      transition._keepDefaultQueryParamValues = false;
    }
  }
});
