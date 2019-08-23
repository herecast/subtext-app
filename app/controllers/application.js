import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import $ from 'jquery';
import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  modals: service(),
  nags: service(),
  searchService: service('search'),
  searchOpen: alias('searchService.searchActive'),
  session: service(),

  currentController: service('current-controller'),

  backgroundClass: computed('currentPath', 'nags.showAppDownloadNag', function() {
    const secondaryBackground = get(this, 'currentController.secondaryBackground');
    const secondaryBackgroundMobile = get(this, 'currentController.secondaryBackgroundMobile');
    let klass = '';

    if (secondaryBackground) {
      klass += 'u-colorBgSecondary';
    }

    if (secondaryBackgroundMobile) {
      klass += ' u-colorBgSecondary--mobile';
    }

    if (get(this, 'nags.showAppDownloadNag')) {
      klass+= ' nag-showing';
    }

    return klass;
  }),

  copyrightYear: computed(function() {
    return moment().format('YYYY');
  }),

  actions: {
    signOut() {
      get(this, 'session').signOut();
    },

    scrollTo(offset) {
      $(window).scrollTop(offset);
    }
  }
});
