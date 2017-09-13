import Ember from 'ember';

const {
  set,
  get,
  computed,
  setProperties
} = Ember;

export default Ember.Component.extend({
  classNames: 'BizFeed',

  organization: null,
  contents: null,
  business: null,

  inPublicPreviewMode: false,
  activeTab: 'public',

  showSearchBox: computed('updateQuery', 'query', 'contents.[]', function() {
    const hasAction = get(this, 'updateQuery');
    const hasQuery = get(this, 'query.length');
    const hasContents = get(this, 'contents.length');

    if(hasAction) {
      return hasQuery || hasContents;
    } else {
      return false;
    }
  }),

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
