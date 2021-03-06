import { gt } from '@ember/object/computed';
import { set, get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import moment from 'moment';
import ModalInstance from 'subtext-app/pods/components/modal-instance/component';

export default ModalInstance.extend({
  api: service(),
  router: service(),
  store: service(),
  session: service(),

  model: null,
  isLoading: false,

  payments: A(),

  init() {
    this._super(...arguments);
    setProperties(this, {
      headers: ['Period Start', 'Period End', 'Views', 'Impressions', 'Total Payment', 'Payment Date']
    });
  },

  hasPayments: gt('payments.length', 0),

  _getCurrentUserPayments() {
    if (!get(this, 'isDestroying') && get(this, 'model')) {
      set(this, 'isLoading', true);

      get(this, 'api').getCurrentUserPayments(get(this, 'model.userId'))
      .then((payload) => {
        this._loadPayments(payload);
      })
      .finally(() => {
        set(this, 'isLoading', false);
      });
    }
  },

  _loadPayments(payload) {
    if (!get(this, 'isDestroying')) {
      const contentPayments = payload.content_payments;
      let payments = [];

      if (contentPayments && contentPayments.length) {

        //Objects need id to be pushed to store
        contentPayments.forEach((payment, index) => {
          payment.id = index +1;
        });

        get(this, 'store').pushPayload('content-payment', payload);

        payments = get(this, 'store').peekAll('content-payment');
      }

      set(this, 'payments', payments);
    }
  },

  _getPaymentReport(payment) {
    let data = {
      period_end: moment(get(payment, 'periodEnd')).format('YYYY-MM-DD'),
      period_start: moment(get(payment, 'periodStart')).format('YYYY-MM-DD'),
      user_id: get(this, 'session.currentUser.userId')
    };

    return get(this, 'api').getPaymentReport(data);
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, 'store').unloadAll('content-payment');
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._getCurrentUserPayments();
  },


  actions: {
    close() {
      this.close();
    },

    getPaymentReport(payment) {
      let wnd = window.open("about:blank", "", "_blank");
      this._getPaymentReport(payment).then(html => {
        wnd.document.write(html);
      });
    },

    goToCreateapage() {
      this.close();
      get(this, 'router').transitionTo('createapage');
    }
  }
});
