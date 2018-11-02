import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import { setProperties, set, get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import moment from 'moment';

export default Component.extend({
  classNames: 'PromotionMenu-PromotionHistory',

  content: null,
  gettingPromotionHistory: false,

  api: service(),

  promotionHistory: A(),

  init() {
    this._getPromotionHistory();
    this._super(...arguments);
  },

  hasPromotionHistory: gt('promotionHistory.length', 0),

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
