import { get, computed } from '@ember/object';
import { readOnly, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import Component from '@ember/component';

export default Component.extend({
  classNames: 'GlobalFilter',

  searchService: service('search'),
  tracking: service(),

  activeFilter: readOnly('searchService.activeFilter'),

  postsIsActive: equal('activeFilter', 'posts'),
  calendarIsActive: equal('activeFilter', 'calendar'),
  marketIsActive: equal('activeFilter', 'market'),
  allIsActive: computed('postsIsActive', 'calendarIsActive', 'marketIsActive', function() {
    return !get(this, 'postsIsActive') && !get(this, 'calendarIsActive') && !get(this, 'marketIsActive');
  }),

  actions: {
    changeFilter(filter) {
      if (filter !== get(this, 'activeFilter')) {
        get(this, 'tracking').trackFeedChannelChange(filter);
      }
    }
  }
});
