import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import {
  setProperties,
  observer,
  computed,
  set,
  get
} from '@ember/object';
import { inject as service } from '@ember/service';
import InViewportMixin from 'ember-in-viewport';

const defaultMessagesArray = [
  {
    message: 'Advertise with HereCast!',
    tag: 'out-with-us'
  },
  {
    message: 'Curious about HereCast ad rates?',
    tag: 'curious-about-rates'
  },
  {
    message: 'Want to see your ad here?',
    tag: 'see-your-out'
  }
];

export default Component.extend(InViewportMixin, {
  classNames: 'OutreachCta',
  classNameBindings: ['isTextOnly:text-only', 'isButton:is-button'],

  api: service(),
  currentController: service(),
  url: alias('currentController.currentUrl'),

  isTextOnly: false,
  isButton: false,
  placement: null,

  limitMessagesTo: null,

  _impressionSent: false,

  ctaTarget: 'https://subtextmedialtd.wufoo.com/forms/sztftvb1xfr0qv/',

  init() {
    this._super(...arguments);
    setProperties(this, {
      defaultMessages: defaultMessagesArray
    });
  },  

  messageIndex: computed('defaultMessages.[]', 'limitMessagesTo.[]', 'url', function () {
    const defaultMessages = get(this, 'defaultMessages');
    const limitMessagesTo = get(this, 'limitMessagesTo');
    const messageArrayLength = isEmpty(limitMessagesTo) ? defaultMessages.length : limitMessagesTo;

    return Math.floor( Math.random() * messageArrayLength );
  }),

  ctaMessage: computed('defaultMessages.[]', 'messageIndex', function () {
    const defaultMessages = get(this, 'defaultMessages');
    const messageIndex = get(this, 'messageIndex');

    return defaultMessages[messageIndex].message;
  }),

  ctaMessageTag: computed('defaultMessages.[]', 'messageIndex', function () {
    const defaultMessages = get(this, 'defaultMessages');
    const messageIndex = get(this, 'messageIndex');

    return defaultMessages[messageIndex].tag;
  }),

  _resetImpression: observer('currentController.currentUrl', function() {
    set(this, '_impressionSent', false);
  }),

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
    get(this, 'api').recordAdMetricEvent({
      ad_metric: {
        campaign: `${get(this, 'placement')}`,
        content: get(this, 'ctaMessageTag'),
        event_type: type,
        page_url: get(this, 'url')
      }
    });
  }

});
