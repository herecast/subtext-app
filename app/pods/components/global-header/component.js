import { get, computed } from '@ember/object';
import { alias, readOnly, equal, not } from '@ember/object/computed';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import TestSelector from 'subtext-app/mixins/components/test-selector';
import Component from '@ember/component';

export default Component.extend(TestSelector, {
  classNames: ['GlobalHeader'],
  classNameBindings: ['showNag:nag-showing'],
  'data-test-nag-visible': readOnly('showNag'),

  fastboot: service(),
  search: service(),
  nags: service(),

  streamlinedHeader: false,
  showFilters: false,
  wantsToChangeLocation: false,

  showNag: readOnly('nags.showAppDownloadNag'),

  isFastBoot: alias('fastboot.isFastBoot'),

  activeChannelFilter: readOnly('search.activeFilter'),

  postsIsActive: equal('activeChannelFilter', 'posts'),
  calendarIsActive: equal('activeChannelFilter', 'calendar'),
  marketIsActive: equal('activeChannelFilter', 'market'),

  showNav: computed('streamlinedHeader', 'isFastBoot', function() {
    if (get(this, 'isFastBoot')) {
      return false;
    }

    return !get(this, 'streamlinedHeader');
  }),

  hideFilters: computed('streamlinedHeader', 'showFilters', 'isFastBoot', function() {
    if (get(this, 'isFastBoot')) {
      return true;
    }

    return get(this, 'streamlinedHeader') || !get(this, 'showFilters');
  }),

  doNotHideFilters: not('hideFilters'),


  actions: {
    logoClicked() {
      $(window).scrollTop(0);
    },

    onCloseNag() {
      get(this, 'nags').hasSeenAppDownloadNag();
    }
  }
});
