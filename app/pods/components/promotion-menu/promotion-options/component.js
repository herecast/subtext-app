import { notEmpty } from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { computed, setProperties, get } from '@ember/object';
import { inject as service } from '@ember/service';
import SocialPreloaded from 'subtext-app/mixins/components/social-preloaded';

export default Component.extend(SocialPreloaded, {
  classNames: 'PromotionMenu-PromotionOptions',

  content: null,
  organization: null,

  hasPromotionToRecord: false,
  lastSharePlatform: null,

  location: service('window-location'),
  api: service(),
  facebook: service(),

  hasOrganization: notEmpty('organization'),

  _urlForShare() {
    const locationService = get(this, 'location');
    const id = get(this, 'content.contentId');
    let baseLink = `${locationService.href()}`;

    if (baseLink.endsWith('mystuff')) {
      baseLink = baseLink.replace('mystuff', 'feed');
    }

    if (get(this, 'content.isCampaign')) {
      return baseLink;
    } else if (get(this, 'content.isEvent')) {
      const eventInstanceId = get(this, 'content.eventInstanceId');
      return `${baseLink}/${id}/${eventInstanceId}`;
    } else {
      return `${baseLink}/${id}`;
    }
  },

  _queuePromotionRecord(platform) {
    if (get(this, 'hasOrganization')) {
      setProperties(this, {
        hasPromotionToRecord: true,
        lastSharePlatform: platform
      });
    }
  },

  mailtoLink: computed('content.title', 'organization.name', function() {
    const href = this._urlForShare();
    const title = encodeURIComponent(get(this, 'content.title'));
    const sharedBy = get(this, 'organization.name');
    const subject = `Shared with you: ${title}`;
    const body = `${sharedBy} shared the following content from dailyUV.com with you: ${href}`;

    return `mailto:?subject=${subject}&body=${body}`;
  }),

  twitterLink: computed('content.{title,isCampaign}', 'organization.name', function() {
    const title = get(this, 'content.isCampaign') ? get(this, 'organization.name') : encodeURIComponent(get(this, 'content.title'));
    const url = this._urlForShare();
    const via = 'thedailyUV';

    return htmlSafe(`http://twitter.com/intent/tweet?text=${title}&url=${url}&via=${via}`);
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
      get(this, 'facebook').ui({
        method: 'share',
        mobile_iframe: true,
        href: urlForShare
      });
    },

    savePromotionRecord() {
      const api = get(this, 'api');
      const contentId = get(this, 'content.contentId');
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
      //eslint-disable-next-line ember/closure-actions
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
