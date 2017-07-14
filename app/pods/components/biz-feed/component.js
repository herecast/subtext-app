import Ember from 'ember';

const {set, setProperties} = Ember;

export default Ember.Component.extend({
  classNames: 'BizFeed',

  organization: null,
  contents: null,
  business: null,

  inPublicPreviewMode: false,
  activeTab: 'public',

  actions: {
    switchTab(tab) {
      set(this, 'activeTab', tab);
    },

    setViewAsPublic(either) {
      setProperties(this, {
        inPublicPreviewMode: either,
        isOrganizationManager: !either
      });
    }
  }
});
