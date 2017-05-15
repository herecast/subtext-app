import Ember from 'ember';

const {
  computed,
  getOwner,
  isEmpty,
  get, set
} = Ember;

export default Ember.Service.extend({
  showHeader: null,
  urlSequence: 0,

  init() {
    this._super(...arguments);

    set(this, 'applicationController', getOwner(this).lookup('controller:application'));
  },

  currentPath: computed.alias('applicationController.currentPath'),

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

  currentUrl: computed(`applicationController.router.url`, function() {
    let router = get(this, 'applicationController.router');

    if (!isEmpty(router.currentPath)) {
      return router.get('url');
    }
  })
});
