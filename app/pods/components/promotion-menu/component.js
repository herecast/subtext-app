import Ember from 'ember';
import moment from 'moment';

const {computed, get, set, isPresent, inject:{service}} = Ember;

export default Ember.Component.extend({
  classNames: 'PromotionMenu',
  classNameBindings: ['showManageOverlay:overlay-open'],

  content: null,
  organization: null,

  showManageOverlay: false,
  showPromotionOptions: false,
  showPromotionHistory: false,
  showAddToMenu: false,
  activeMenu: 'main',

  location: service('window-location'),
  store: service(),
  api: service(),
  modals: service(),
  notify: service('notification-messages'),
  contentMetrics: service(),

  isNotBannerAd: computed.not('content.isCampaign'),
  hasSunsetDate: computed.notEmpty('content.sunsetDate'),
  hasOrganization: computed.notEmpty('organization'),

  sunsetDate: computed('content.sunsetDate', function() {
    return moment(get(this, 'content.sunsetDate')).format('MMMM DD, YYYY');
  }),

  bizIsOwner: computed('organization.id', 'content.organizationId', function() {
    const contentOrganizationId = get(this, 'content.organizationId');
    const organizationId = get(this, 'organization.id');

    return parseInt(contentOrganizationId) === parseInt(organizationId);
  }),

  contentHotlink: computed('organization.customLinks', 'content.contentId', function() {
    const customLinks = get(this, 'organization.customLinks') || [];
    const contentId = get(this, 'content.contentId');

    return isPresent(customLinks) ? customLinks.findBy('contentId', contentId) : null;
  }),

  currentHotlinkTitle: computed.oneWay('contentHotlink.title'),

  updateExpirationDate(sunsetDate) {
    const notify = get(this, 'notify');
    const content = get(this, 'content');

    set(content, 'sunsetDate', sunsetDate);

    content.save().then(
      () => notify.success('Update successful'),
      () => notify.error('Update failed. Please try again.')
    );
  },

  actions: {
    close() {
      if (this.close) {
        this.close();
      }
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
      get(this, 'modals').showModal('modals/date-picker')
        .then((date) => {
          this.updateExpirationDate(moment(date));
        })
        .catch(() => {});
    },

    removeSunsetDate() {
      this.updateExpirationDate(null);
    },

    openContentMetrics() {
      get(this, 'modals').showModal('modals/content-metrics', get(this, 'content'));
    }
  }
});
