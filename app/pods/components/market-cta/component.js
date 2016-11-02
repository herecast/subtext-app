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
  'data-test-component': 'market-cta',

  // cancellable run loop invocation
  _pendingImpression: null,

  _didSendImpression: false,

  _sendImpression() {
    console.info('Impression of market-cta');
    if (typeof dataLayer !== "undefined") {
      dataLayer.push({
        'event': 'market-cta-impression'
      });
    }
    set(this, '_didSendImpression', true);
  },

  featuredMarketCategories: computed(function() {
    return [{
      query: 'winter tires',
      title: 'Winter Tires',
      image: 'https://d3ctw1a5413a3o.cloudfront.net/content/869764/38d883dba940195a-blob.jpeg'
    },{
      query: 'antique',
      title: 'Antiques',
      image: 'https://d3ctw1a5413a3o.cloudfront.net/content/869764/47a68c320b130fe4-Screen_Shot_2016-08-25_at_11.43.10_AM.png'
    },{
      query: 'clothing',
      title: 'Clothes',
      image: 'https://d3ctw1a5413a3o.cloudfront.net/content/869764/5f517c01f0278c02-jeans-226422_960_720.jpg'
    }];
  }),

  featuredMarketLinks: computed(() => {
    return [{
        query: 'ski',
        text: 'Ski'
      },{
        query: 'shoe',
        text: 'Shoes'
      },{
        query: 'boots',
        text: 'Boots'
      },{
        query: 'job',
        text: 'Help Wanted'
      },{
        query: 'job',
        text: 'Wanted'
      },{
        query: 'couch',
        text: 'Furniture'
      }
    ];
  }),

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
        top    : 230, // half the ad height
        bottom : 230, // half the ad height
        left   : 20,
        right  : 20
      }
    });
  },
});
