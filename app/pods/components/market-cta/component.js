import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
/* global dataLayer */

const {
  computed,
  setProperties,
  get,
  set,
  run
} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  // TODO extract this into an 'Impressionable' component mixin
  'data-test-component': 'market-cta',

  variation: null,

  // cancellable run loop invocation
  _pendingImpression: null,

  _didSendImpression: false,

  _sendImpression() {
    if (typeof dataLayer !== "undefined") {
      dataLayer.push({
        'event': 'market-detail-createPost-cta-impression',
        'variation': get(this, 'variation'),
        'variation_image': get(this, 'imgUrl')
      });
    }
    console.log('impression: market-detail-createPost-cta-impression');

    set(this, '_didSendImpression', true);
  },

  _canSendImpression: computed('_didSendImpression', function() {
    return !get(this, '_didSendImpression');
  }),

  didEnterViewport() {
    if (get(this, '_canSendImpression')) {
      set(this, '_pendingImpression', run.later(this, this._sendImpression, 500));
    }
  },

  didExitViewport() {
    run.cancel(get(this, '_pendingImpression'));
  },

  didInsertElement() {
    this._super(...arguments);
    this._viewportOptionsOverride();
  },

  willDestroyElement() {
    this._super(...arguments);

    run.cancel(get(this, '_pendingImpression'));
  },

  _viewportOptionsOverride() {
    // ensures the ad is at least 50% visible
    // before it is considered visible
    setProperties(this, {
      viewportUseRAF   : true,
      viewportSpy      : true,
      viewportTolerance: {
        top    : 50,
        bottom : 50,
        left   : 20,
        right  : 20
      }
    });
  },

  actions: {
    trackClick() {
      if (typeof dataLayer !== "undefined") {
        dataLayer.push({
          'event': 'market-detail-createPost-cta-click',
          'variation': get(this, 'variation'),
          'variation_image': get(this, 'imgUrl')
        });
      }

      console.log('click: market-detail-createPost-cta-click');
    }
  }
});
