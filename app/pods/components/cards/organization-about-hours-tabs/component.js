import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({
  organization: null,

  activeTab: 'about',

  isAboutTabActive: equal('activeTab', 'about'),
  isHoursTabActive: equal('activeTab', 'hours'),

  actions: {
    setActiveTab(tabName) {
      set(this, 'activeTab', tabName);
    }
  }
});
