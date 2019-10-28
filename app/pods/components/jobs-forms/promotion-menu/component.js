import { get, set, computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import $ from 'jquery';
import moment from 'moment';
import TextSnippet from 'subtext-app/mixins/components/text-snippet';
import SocialPreloaded from 'subtext-app/mixins/components/social-preloaded';
import Component from '@ember/component';

export default Component.extend(TextSnippet, SocialPreloaded, {
  classNames: ['JobsForms-PromotionMenu'],

  api: service(),
  session: service(),
  facebook: service(),
  floatingActionButton: service(),
  windowLocation: service(),
  modals: service(),

  socialPreloadedOnDidInsert: true,

  model: null,
  onClose: function() {},

  isCopyingLink: false,
  showEmailMenu: false,
  maxSnippetLength: 140,

  content: readOnly('model.content'),

  justCreated: readOnly('floatingActionButton.justCreated'),
  justEdited: readOnly('floatingActionButton.justEdited'),

  isMarket: readOnly('model.isMarket'),
  isEvent: readOnly('model.isEvent'),

  init() {
    set(this, 'mailToParts', '');

    this._super(...arguments);
  },

  currentUser: readOnly('session.currentUser'),

  sharedBy: readOnly('currentUser.name'),

  twitterLink: computed('model.title', function() {
    const title = encodeURIComponent(get(this, 'model.title'));
    const url = get(this, 'urlForShare');
    const via = 'HereCastUS';

    return htmlSafe(`http://twitter.com/intent/tweet?text=${title}&url=${url}&via=${via}`);
  }),

  urlForShare: computed('model.{contentId,eventInstanceId}', function() {
    const windowLocation = get(this, 'windowLocation');
    const id = get(this, 'model.contentId');
    let baseLink = `${windowLocation.host()}`;

    if (get(this, 'model.isEvent')) {
      const eventInstanceId = get(this, 'model.eventInstanceId');
      return htmlSafe(`https://${baseLink}/${id}/${eventInstanceId}`);
    } else {
      return htmlSafe(`https://${baseLink}/${id}`);
    }
  }),

  _buildMailToParts() {
    let urlForShare = get(this, 'urlForShare');
    const title = get(this, 'model.title');
    const contentLocation = get(this, 'model.location.name');
    const sharedBy = get(this, 'sharedBy');
    const contentType = get(this, 'model.contentType');
    const contentExcerpt = get(this, 'textSnippet') + '...';
    let to, subject, body;

    to = '';
    body = `${contentExcerpt}\n\nSee the full content shared by ${sharedBy} at HereCast:\n${urlForShare}`;
    subject = `${contentLocation} | ${title}`;

    if (contentType === 'market' && get(this, 'model.cost')) {
      subject = `${title} - ${get(this, 'model.cost')}`;
    } else if (contentType === 'event' && get(this, 'model.startsAt')) {
      const startsAt = moment(get(this, 'model.startsAt')).format('MMMM Do');
      subject = `${title} - ${startsAt}`;
    }

    set(this, 'mailToParts', {to, subject, body});
  },

  actions: {
    close() {
      get(this, 'floatingActionButton').promotionMenuClosed();
      this.onClose();
    },

    shareFacebook() {
      const urlForShare = get(this, 'urlForShare');

      get(this, 'facebook').ui({
        method: 'share',
        mobile_iframe: true,
        href: urlForShare.string
      });
    },

    copyLink() {
      set(this, 'isCopyingLink', true);
      const textarea = $(get(this, 'element')).find('#copy-url-textarea');
      textarea.select();
      document.execCommand('copy');

      later(() => {
        set(this, 'isCopyingLink', false);
      }, 800);
    },

    startShareByEmail() {
      this._buildMailToParts();
      set(this, 'showEmailMenu', true);
    },

    hideEmailMenu() {
      set(this, 'showEmailMenu', false);
    }
  }
});
