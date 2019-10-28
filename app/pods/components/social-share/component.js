import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { next, later } from '@ember/runloop';
import SocialPreloaded from 'subtext-app/mixins/components/social-preloaded';
import SocialSharing from 'subtext-app/utils/social-sharing';
import $ from 'jquery';

export default Component.extend(SocialPreloaded, {
  location: service('window-location'),
  logger: service(),
  facebook: service(),
  notify: service('notification-messages'),

  classNames: ['SocialShare u-flexRow'],
  isPreview: false,
  isCopyingLink: false,


  model: null,
  hiddenLink: null,

  router: service(),

  urlForShare() {
    const model = get(this, 'model');
    const locationService = get(this, 'location');

    return SocialSharing.getShareUrl(locationService, model);
  },

  mailtoLink: computed('title', 'sharedBy', function() {
    const href = this.urlForShare();
    const title = encodeURIComponent(get(this, 'title'));
    const sharedBy = get(this, 'sharedBy');
    const subject = `Shared with you: ${title}`;
    let body;

    if (sharedBy) {
      body = `${sharedBy} shared the following content from HereCast.us with you: ${href}`;
    } else {
      body = `I want to share the following content from HereCast.us with you: ${href}`;
    }

    return htmlSafe(`mailto:?subject=${subject}&body=${body}`);
  }),

  twitterLink: computed('title', 'authorName', 'twitterHandle', function() {
    const authorName = get(this, 'authorName');
    const twitterHandle = get(this, 'twitterHandle');
    const title = get(this, 'title');
    let twitterTitle;

    if(twitterHandle) {
      twitterTitle = encodeURIComponent(`${title} - by ${twitterHandle} on HereCast`);
    } else if(authorName && authorName !== 'HereCast') {
      twitterTitle = encodeURIComponent(`${title} - by ${authorName} on HereCast`);
    } else {
      twitterTitle = encodeURIComponent(`${title} on HereCast`);
    }

    const url = this.urlForShare();

    return htmlSafe(`http://twitter.com/intent/tweet?text=${twitterTitle}&url=${url}&via=HereCastUS`);
  }),


  actions: {
    shareFacebook() {
      const urlForShare = this.urlForShare();

      //for live debug
      get(this, 'logger').info(`Share to facebook of ${urlForShare}`);

      get(this, 'facebook').ui({
        method: 'share',
        mobile_iframe: true,
        href: urlForShare
      });
    },

    copyToClipboard() {
      const urlForShare = this.urlForShare();

      set(this, 'isCopyingLink', true);

      set(this, 'hiddenLink', urlForShare);

      next(() => {
        const $textarea = $(get(this, 'element')).find('#hidden-link');
        $textarea.focus();
        $textarea.select();
        document.execCommand('copy');

        later(() => {
          get(this, 'notify').success('Link has been copied to clipboard');
          set(this, 'isCopyingLink', false);
        }, 800);
      });
    }
  }
});
