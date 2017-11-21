import Ember from 'ember';

const {set, computed} = Ember;

export default Ember.Component.extend({
  organization: null,

  activeTab: 'about',

  isAboutTabActive: computed.equal('activeTab', 'about'),
  isHoursTabActive: computed.equal('activeTab', 'hours'),

  actions: {
    setActiveTab(tabName) {
      set(this, 'activeTab', tabName);
    }
  }
});
