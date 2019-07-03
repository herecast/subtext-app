import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import $ from 'jquery';
import Controller from '@ember/controller';
import { get, computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  modals: service(),
  searchService: service('search'),
  searchOpen: alias('searchService.searchActive'),

  currentController: service('current-controller'),

  backgroundClass: computed('currentPath', function() {
    const secondaryBackground = get(this, 'currentController.secondaryBackground');
    const secondaryBackgroundMobile = get(this, 'currentController.secondaryBackgroundMobile');
    let klass = '';

    if (secondaryBackground) {
      klass += 'u-colorBgSecondary';
    }
    if (secondaryBackgroundMobile) {
      klass += ' u-colorBgSecondary--mobile';
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
