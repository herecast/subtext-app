import { gt } from '@ember/object/computed';
import { set, get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';

export default ModalInstance.extend({
  api: service(),
  store: service(),
  session: service(),

  model: null,
  isLoading: false,

  init() {
    this._super(...arguments);
    setProperties(this, {
      headers: ['Period Start', 'Period End', 'Impressions', 'Pay per Impression', 'Total Payment', 'Payment Date'],
      payments: [],
    });
  },

  hasPayments: gt('payments.length', 0),

  _getOrganizationPayments() {
    if (!get(this, 'isDestroying') && get(this, 'model')) {
      set(this, 'isLoading', true);

      get(this, 'api').getOrganizationPayments(get(this, 'model.id'))
      .then((payload) => {
        this._loadPayments(payload);
      })
      .finally(() => {
        set(this, 'isLoading', false);
      });
    }
  },

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

      if (contentPayments.length) {

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

    const model = get(this, 'model');
    const modelName = get(model, 'constructor.modelName');

    if (modelName === 'organization') {
      this._getOrganizationPayments();
    } else if (modelName === 'current-user') {
      this._getCurrentUserPayments();
    }
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
    }
  }
});
