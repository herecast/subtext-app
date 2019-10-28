import { get } from '@ember/object';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-SettingsBar'],

  caster: null,
  activeTab: null,

  changeTab: function() {},

  accountIsActive: equal('activeTab', 'account'),
  casterPageIsActive: equal('activeTab', 'casterPage'),
  feedSettingsIsActive: equal('activeTab', 'feedSettings'),
  paymentsIsActive: equal('activeTab', 'payments'),

  actions: {
    changeTab(tab) {
      get(this, 'changeTab')(tab);
    }
  }
});
