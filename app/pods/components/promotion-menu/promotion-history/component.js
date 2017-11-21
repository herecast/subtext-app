import Ember from 'ember';
import moment from 'moment';

const { computed, get, set, setProperties, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'PromotionMenu-PromotionHistory',

  content: null,

  gettingPromotionHistory: false,

  api: service(),

  promotionHistory: [],
  hasPromotionHistory: computed.gt('promotionHistory.length', 0),

  promotionRecords: computed('promotionHistory', function() {
    const promotionHistory = get(this, 'promotionHistory');

    return promotionHistory.map((record) => {
      return {
        date: moment(record.created_at).format('DD-MMM-YY (hh:mm a)'),
        share_platform: record.share_platform,
        created_by: record.created_by.name
      };
    });
  }),

  init() {
    this._getPromotionHistory();
    this._super(...arguments);
  },

  _getPromotionHistory() {
    const api = get(this, 'api');
    const contentId = get(this, 'content.id');

    set(this, 'gettingPromotionHistory', true);

    api.getOrganizationContentPromotions(contentId).then((response) => {
      setProperties(this, {
        promotionHistory: response.promotions,
        gettingPromotionHistory: false
      });
    });
  },

  actions: {
    done() {
      const done = get(this, 'done');
      if (done) {
        done();
      }
    }
  }
});
