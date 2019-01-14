import { get, set, setProperties, computed } from '@ember/object';
import { readOnly, sort } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import $ from 'jquery';
import moment from 'moment';
import TextSnippet from 'subtext-ui/mixins/components/text-snippet';
import SocialPreloaded from 'subtext-ui/mixins/components/social-preloaded';
import Component from '@ember/component';

export default Component.extend(TextSnippet, SocialPreloaded, {
  classNames: ['JobsForms-PromotionMenu'],

  api: service(),
  session: service(),
  facebook: service(),
  windowLocation: service(),
  modals: service(),

  socialPreloadedOnDidInsert: true,

  model: null,
  onClose: function() {},

  isCopyingLink: false,
  wantsToShareToListservs:false,
  showEmailMenu: false,
  maxSnippetLength: 140,

  content: readOnly('model.content'),

  init() {
    setProperties(this, {
      listservs: [],
      listservsToEmail: [],
      listservsSortBy: ['name'],
      mailToParts: ''
    });

    this._getListservs();

    this._super(...arguments);
  },

  sortedListservs: sort('listservs', 'listservsSortBy'),

  currentUser: readOnly('session.currentUser'),
  organization: readOnly('model.organization'),
  hasOrganization: computed('organization.id', function() {
    return isPresent(get(this, 'organization')) && parseInt(get(this, 'organization.id')) !== 398;
  }),

  sharedBy: computed('hasOrganization', 'currentUser.name', function() {
    return get(this, 'hasOrganization') ? get(this, 'organization.name') : get(this, 'currentUser.name');
  }),

  twitterLink: computed('model.title', function() {
    const title = encodeURIComponent(get(this, 'model.title'));
    const url = get(this, 'urlForShare');
    const via = 'thedailyUV';

    return htmlSafe(`http://twitter.com/intent/tweet?text=${title}&url=${url}&via=${via}`);
  }),

  chosenListservEmails: computed('listservs.@each.isChecked', function() {
    let listservEmails = [];

    get(this, 'listservs').forEach((listserv) => {
      if (get(listserv, 'isChecked')) {
        listservEmails.push(get(listserv, 'reverse_publish_email'));
      }
    });

    return listservEmails;
  }),

  urlForShare: computed('model.{contentId,eventInstanceId}', 'hasOrganization', function() {
    const windowLocation = get(this, 'windowLocation');
    const id = get(this, 'model.contentId');
    let baseLink = `${windowLocation.host()}`;

    if (baseLink.endsWith('mystuff')) {
      baseLink = baseLink.replace('mystuff', '');
    }

    if (get(this, 'hasOrganization')) {
      baseLink += `/profile/${get(this, 'organization.id')}`;
    }

    if (get(this, 'model.isEvent')) {
      const eventInstanceId = get(this, 'model.eventInstanceId');
      return htmlSafe(`https://${baseLink}/${id}/${eventInstanceId}`);
    } else {
      return htmlSafe(`https://${baseLink}/${id}`);
    }
  }),

  _getListservs() {
    get(this, 'api').getListServs()
    .then((response) => {
      set(this, 'listservs', response.listservs);
    });
  },

  _buildMailToParts(forListservs=false) {
    let urlForShare = get(this, 'urlForShare');
    const title = get(this, 'model.title');
    const contentLocation = get(this, 'model.location.name');
    const sharedBy = get(this, 'sharedBy');
    const contentType = get(this, 'model.contentType');
    const contentExcerpt = get(this, 'textSnippet') + '...';
    let to, subject, body;

    to = '';
    body = `${contentExcerpt}\n\nSee the full content shared by ${sharedBy} at DailyUV:\n${urlForShare}`;

    if (forListservs) {
      to = get(this, 'chosenListservEmails').join(',');
      const shortLink = get(this, 'model.shortLink');

      if (isPresent(shortLink)) {
        urlForShare = shortLink;
      }

      body = `${contentExcerpt}\n\nSee the full content shared by ${sharedBy} at: ${urlForShare}`;
    }

    subject = `${contentLocation} | ${title}`;

    if (contentType === 'market' && get(this, 'model.cost')) {
      subject = `${title} - ${get(this, 'model.cost')}`;
    } else if (contentType === 'event' && get(this, 'model.startsAt')) {
      const startsAt = moment(get(this, 'model.startsAt')).format('MMMM Do');
      subject = `${title} - ${startsAt}`;
    }

    set(this, 'mailToParts', {to, subject, body});
  },

  _hideOpenMenuItems() {
    set(this, 'wantsToShareToListservs', false);
  },

  actions: {
    close() {
      this.onClose();
    },

    shareFacebook() {
      const urlForShare = get(this, 'urlForShare');

      get(this, 'facebook').ui({
        method: 'share',
        mobile_iframe: true,
        href: urlForShare
      });

      this._hideOpenMenuItems();
    },

    shareTwitter() {
      this._hideOpenMenuItems();
    },

    copyLink() {
      this._hideOpenMenuItems();

      set(this, 'isCopyingLink', true);
      const textarea = $(get(this, 'element')).find('#copy-url-textarea');
      textarea.select();
      document.execCommand('copy');

      later(() => {
        set(this, 'isCopyingLink', false);
      }, 800);
    },

    startShareByEmail() {
      this._hideOpenMenuItems();

      this._buildMailToParts();
      set(this, 'showEmailMenu', true);
    },

    hideEmailMenu() {
      set(this, 'showEmailMenu', false);
    },

    startShareListservs() {
      this._buildMailToParts(true);
      this.toggleProperty('wantsToShareToListservs');
    },

    toggleListserv(listservId) {
      const listservs = get(this, 'listservs');
      const listserv = listservs.findBy('id', listservId);

      if (get(listserv, 'isChecked')) {
        set(listserv, 'isChecked', false);
      } else {
        set(listserv, 'isChecked', true);
      }
    },

    shareListservs() {
      this._buildMailToParts(true);
      set(this, 'showEmailMenu', true);
    }
  }
});
