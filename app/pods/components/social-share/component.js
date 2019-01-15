import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import SocialPreloaded from 'subtext-ui/mixins/components/social-preloaded';
import SocialSharing from 'subtext-ui/utils/social-sharing';

export default Component.extend(SocialPreloaded, {
  location: service('window-location'),
  logger: service(),
  facebook: service(),

  classNames: ['SocialShare u-flexRow'],
  isPreview: false,

  model: null,

  router: service(),

  urlForShare() {
    const model = get(this, 'model');
    const locationService = get(this, 'location');
    const routeName = get(this,'router.currentRouteName') || '';
    const fromProfile = routeName.startsWith('profile');

    return SocialSharing.getShareUrl(locationService, model, fromProfile);
  },

  mailtoLink: computed('title', 'sharedBy', function() {
    const href = this.urlForShare();
    const title = encodeURIComponent(get(this, 'title'));
    const sharedBy = get(this, 'sharedBy');
    const subject = `Shared with you: ${title}`;
    let body;

    if (sharedBy) {
      body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;
    } else {
      body = `I want to share the following content from dailyUV.com with you: ${href}`;
    }

    return htmlSafe(`mailto:?subject=${subject}&body=${body}`);
  }),

  twitterLink: computed('title', 'authorName', 'twitterHandle', function() {
    const authorName = get(this, 'authorName');
    const twitterHandle = get(this, 'twitterHandle');
    const title = get(this, 'title');
    let twitterTitle;

    if(twitterHandle) {
      twitterTitle = encodeURIComponent(`${title} - by ${twitterHandle} on DailyUV`);
    } else if(authorName && authorName !== 'DailyUV') {
      twitterTitle = encodeURIComponent(`${title} - by ${authorName} on DailyUV`);
    } else {
      twitterTitle = encodeURIComponent(`${title} on DailyUV`);
    }

    const url = this.urlForShare();
    const hashtags = 'UpperValley';

    return htmlSafe(`http://twitter.com/intent/tweet?text=${twitterTitle}&url=${url}&hashtags=${hashtags}`);
  }),

  orgHashtag: computed('model.organization.name', function(){
    const orgName = get(this, 'model.organization.name');
    const content_type = get(this, 'model.contentType');
    if (content_type === 'news' && orgName) {
      const formattedOrgName = orgName.replace(/[^a-zA-Z0-9]/g, '');
      return `#${formattedOrgName}`;
    } else {
      return '';
    }
  }),

  actions: {
    shareFacebook() {
      const urlForShare = this.urlForShare();
      const orgHashtag = get(this, 'orgHashtag');

      //for live debug
      get(this, 'logger').info(`Share to facebook of ${urlForShare}`);

      get(this, 'facebook').ui({
        method: 'share',
        mobile_iframe: true,
        hashtag: orgHashtag,
        href: urlForShare
      });
    }
  }
});
