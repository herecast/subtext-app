import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { isEmpty } from '@ember/utils';
import { set, get, computed } from '@ember/object';

export default Service.extend({
  router: service(),

  showHeader: null,
  urlSequence: 0,

  init() {
    this._super(...arguments);

    set(this, 'applicationController', getOwner(this).lookup('controller:application'));
  },

  currentPath: alias('applicationController.currentPath'),

  currentChannel: computed('currentController', function() {
    const currentPath = get(this, 'currentPath');

    return (currentPath) ? get(this, 'currentPath').split('.').shift() : null;
  }),

  currentController: computed('currentPath', function() {
    return getOwner(this).lookup(`controller:${get(this,'currentPath')}`);
  }),

  secondaryBackground: computed('currentController.secondaryBackground', function() {
    return get(this, 'currentController.secondaryBackground');
  }),

  secondaryBackgroundMobile: computed('currentController.secondaryBackgroundMobile', function() {
    return get(this, 'currentController.secondaryBackgroundMobile');
  }),

  currentUrl: computed('router.url', function() {
    let router = get(this, 'router');

    if (!isEmpty(router.currentPath)) {
      return router.get('url');
    }
  })
});
