import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {
  inject,
  computed,
  setProperties,
  get,
  set,
  run
} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  'data-test-component': 'market-digest-subscribe-banner',

  featureFlags: inject.service('feature-flags'),

  variation: null,

  // cancellable run loop invocation
  _pendingImpression: null,

  _didSendImpression: false,

  _canSendImpression: computed('_didSendImpression', function() {
    return !get(this, '_didSendImpression');
  }),

  _sendImpression() {
    this.tracking.push({
      'event': 'market-digest-subscribe',
      'type': 'impression'
    });

    set(this, '_didSendImpression', true);
  },

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
        top    : 10,
        bottom : 10,
        left   : 10,
        right  : 10
      }
    });
  },

  actions: {
    trackClick() {
      this.tracking.push({
        'event': 'market-digest-subscribe',
        'type': 'click'
      });
    }
  }
});
