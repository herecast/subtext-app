import Ember from 'ember';
import SocialSharing from 'subtext-ui/utils/social-sharing';
/* global FB */

const { get, setProperties, computed, inject:{service}} = Ember;

export default Ember.Component.extend({
  classNames: 'BizFeed-PromotionOptions',

  content: null,
  organization: null,

  hasPromotionToRecord: false,
  lastSharePlatform: null,

  location: service('window-location'),
  api: service(),

  _urlForShare() {
    const locationService = get(this, 'location');
    const model = get(this, 'content');
    
    return SocialSharing.getShareUrl(locationService, model);
  },

  _queuePromotionRecord(platform) {
    setProperties(this, {
      hasPromotionToRecord: true,
      lastSharePlatform: platform
    });
  },

  contentId: computed('content.{contentType,contentId,eventInstanceId}', function() {
    return get(this, 'content.contentType') === 'event' ? get(this, 'content.eventInstanceId') : get(this, 'content.contentId');
  }),

  mailtoLink: computed('content.title', function() {
    const href = this._urlForShare();
    const title = encodeURIComponent(get(this, 'content.title'));
    const sharedBy = get(this, 'organization.name');
    const subject = `Shared with you: ${title}`;
    const body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;

    return `mailto:?subject=${subject}&body=${body}`;
  }),

  twitterLink: computed('content.title', function() {
    const ctype = get(this, 'content.contentType');
    const title = ctype === 'campaign' ? get(this, 'organization.name') : encodeURIComponent(get(this, 'content.title'));
    const url = this._urlForShare();
    const via = 'thedailyUV';

    return Ember.String.htmlSafe(`http://twitter.com/intent/tweet?text=${title}&url=${url}&via=${via}`);
  }),

  actions: {
    shareTwitter() {
      this._queuePromotionRecord('twitter');
    },

    shareEmail() {
      this._queuePromotionRecord('email');
    },

    shareFacebook() {
      this._queuePromotionRecord('facebook');

      const urlForShare = this._urlForShare();

      FB.ui({
        method: 'share',
        mobile_iframe: true,
        href: urlForShare
      });
    },

    savePromotionRecord() {
      const api = get(this, 'api');
      const contentId = get(this, 'content.id');
      const promotionRecord = {
        organization_id: get(this, 'organization.id'),
        share_platform: get(this, 'lastSharePlatform'),
        created_by: get(this, 'session.currentUser.userId')
      };

      api.recordOrganizationContentPromotion(contentId, promotionRecord).then(() => {
        this.send('dumpPromotionRecord');
      });
    },

    dumpPromotionRecord() {
      setProperties(this, {
        hasPromotionToRecord: false,
        lastSharePlatform: null
      });
      this.sendAction('done');
    },

    done() {
      const done = get(this, 'done');
      if (done) {
        done();
      }
    }
  }
});
