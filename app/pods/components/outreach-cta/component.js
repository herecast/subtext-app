import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';

const {get, set, computed, isEmpty, setProperties, inject:{service}} = Ember;

export default Ember.Component.extend(InViewportMixin, {
  classNames: 'OutreachCta',
  classNameBindings: ['isTextOnly:text-only', 'isButton:is-button'],

  api: service(),
  currentController: service(),

  isTextOnly: false,
  isButton: false,
  placement: null,

  limitMessagesTo: null,

  _impressionSent: false,


  defaultMessages: [
    {
      message: 'Advertise with DailyUV!',
      tag: 'out-with-us'
    },
    {
      message: 'Curious about DailyUV ad rates?',
      tag: 'curious-about-rates'
    },
    {
      message: 'Want to see your ad here?',
      tag: 'see-your-out'
    }
  ],

  defaultTargets: [
    {
      url: 'https://subtextmedialtd.wufoo.com/forms/s1nqgrje1gdj90w/',
      tag: 'verbose'
    },
    {
      url: 'https://subtextmedialtd.wufoo.com/forms/sztftvb1xfr0qv/',
      tag: 'succinct'
    }
  ],

  ctaMessage: null,
  ctaTarget: null,
  ctaMessageTag: null,
  ctaTargetTag: null,

  _setupMessaging() {
    let defaultMessages = get(this, 'defaultMessages');
    let limitMessagesTo = get(this, 'limitMessagesTo');

    let messageArrayLength = isEmpty(limitMessagesTo) ? defaultMessages.length : limitMessagesTo;
    let randomIndex = Math.floor( Math.random() * messageArrayLength );

    set(this, 'ctaMessage', defaultMessages[randomIndex].message );
    set(this, 'ctaMessageTag', defaultMessages[randomIndex].tag );
  },

  _setupTargeting() {
    let defaultTargets = get(this, 'defaultTargets');
    let randomIndex = Math.floor( Math.random() * defaultTargets.length );

    set(this, 'ctaTarget', defaultTargets[randomIndex].url);
    set(this, 'ctaTargetTag', defaultTargets[randomIndex].tag);
  },

  _resetImpression() {
    set(this, 'url', get(this, 'currentController.currentUrl'));
    set(this, '_impressionSent', false);
  },

  _resetAll() {
    this._setupMessaging();
    this._setupTargeting();
    this._resetImpression();
  },

  currentUrl: computed('currentController.currentUrl', function() {
    if (get(this, 'currentController.currentUrl') !== get(this, 'url')) {
      this._resetAll();
    }
  }),

  init() {
    this._super();
    this._resetAll();
  },

  didInsertElement() {
    this._super();
    setProperties(this, {
      viewportUseRAF: true,
      viewportSpy: true,
    });
  },

  didEnterViewport() {
    if (!get(this, '_impressionSent')){
      this.recordEvent('impression');
      set(this, '_impressionSent', true);
    }
  },

  click(e) {
    e.stopPropagation();//stops false click into ad-banner
    this.recordEvent('click');
  },

  recordEvent(type) {
    get(this, 'api').recordOutreachCtaEvent({
      ad_metric: {
        campaign: `${get(this, 'placement')}--${get(this,'ctaTargetTag')}`,
        content: get(this, 'ctaMessageTag'),
        event_type: type,
        page_url: get(this, 'url')
      }
    });
  }

});
