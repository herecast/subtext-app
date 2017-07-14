import Ember from 'ember';
import moment from 'moment';


const {computed, get, set, isPresent, inject:{service}} = Ember;

export default Ember.Component.extend({
  classNames: 'BizFeed-CardManage',
  classNameBindings: ['showManageOverlay:overlay-open'],

  content: null,
  business: null,
  organization: null,

  showManageOverlay: false,
  showPromotionOptions: false,
  showPromotionHistory: false,
  showAddToMenu: false,
  activeMenu: 'main',
  currentHotlinkTitle: null,

  location: service('window-location'),
  store: service(),
  api: service(),
  modals: service(),

  _setContentStatus(data) {
    const organizationId = get(this, 'organization.id');
    const contentId = get(this, 'content.id');
    return get(this, 'api').setOrganizationContentStatus(organizationId, contentId, data);
  },

  isBannerAd: computed.equal('content.contentType', 'campaign'),
  hasSunsetDate: computed.notEmpty('content.sunsetDate'),

  sunsetDate: computed('content.sunsetDate', function() {
    return moment(get(this, 'content.sunsetDate')).format('MMMM DD, YYYY');
  }),

  contentId: computed('content.{contentType,contentId,eventInstanceId}', function() {
    return get(this, 'content.contentType') === 'event' ? get(this, 'content.eventInstanceId') : get(this, 'content.contentId');
  }),

  editRoute: computed('content.contentType', function() {
    const contentType = get(this, 'content.contentType');
    const baseRoute = contentType === 'event' ? 'events' : contentType;

    return `${baseRoute}.edit`;
  }),

  editId: computed('content.contentType', function() {
    const contentType = get(this, 'content.contentType');

    return contentType === 'event' ? get(this, 'content.eventId') : get(this, 'content.contentId');
  }),

  canEdit: computed('bizIsOwner', 'isBannerAd', function() {
    if (!get(this, 'isBannerAd')) {
      return get(this, 'bizIsOwner');
    } else {
      return false;
    }
  }),

  bizIsOwner: computed('organization.id', 'content.organizationId', function() {
    const contentOrganizationId = get(this, 'content.organizationId');
    const organizationId = get(this, 'organization.id');

    return parseInt(contentOrganizationId) === parseInt(organizationId);
  }),

  contentIsHotlink: computed('organization.customLinks', 'contentId', function() {
    const customLinks = get(this, 'organization.customLinks') || [];

    if (isPresent(customLinks)){
      const contentId = get(this, 'contentId');
      const matchingLink = customLinks.find((customLink) => {
        return customLink.content_id === contentId;
      });

      if (isPresent(matchingLink)) {
        set(this, 'currentHotlinkTitle', matchingLink.title);
        return true;
      }
    }

    return false;
  }),

  actions: {
    toggleManageOverlay() {
      this.toggleProperty('showManageOverlay');
    },

    togglePromotionOptions() {
      this.toggleProperty('showPromotionOptions');
    },

    togglePromotionHistory() {
      this.toggleProperty('showPromotionHistory');
    },

    changeActiveMenu(name) {
      set(this, 'activeMenu', name);
    },

    toggleAddToMenu() {
      this.toggleProperty('showAddToMenu');
    },

    openCalendarWidget() {
      get(this, 'modals').showModal('modals/date-picker').then((date) => {
        const formattedDate = moment(date);
        const data = {
          sunset_date: formattedDate
        };

        set(this, 'content.sunsetDate', moment(date));

        this._setContentStatus(data);
      });
    },

    removeSunsetDate() {
      const data = {
        sunset_date: null
      };

      set(this, 'content.sunsetDate', null);

      this._setContentStatus(data);
    }
  }
});
