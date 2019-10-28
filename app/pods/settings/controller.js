import { get, set } from '@ember/object';
import { alias, equal, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  fastboot: service(),
  session: service(),

  currentUser: alias('session.currentUser'),

  shouldShowCasterIntroModal: readOnly('session.shouldShowCasterIntroModal'),

  activeTab: 'casterPage',

  showAccount: equal('activeTab', 'account'),
  showCasterPage: equal('activeTab', 'casterPage'),
  showFeedSettings: equal('activeTab', 'feedSettings'),
  showPayments: equal('activeTab', 'payments'),

  actions: {
    changeTab(activeTab) {
      set(this, 'activeTab', activeTab);
    },

    onCloseCasterIntro() {
      get(this, 'session').teardownCasterIntroModal();
    }
  }
});
