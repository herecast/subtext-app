import Ember from 'ember';

const { get, set, computed } = Ember;

const contentTabs = [
  {
    name: 'posts',
    title: 'Posts',
    isActive: true,
    calendarView: false
  },
  {
    name: 'calendar',
    title: 'Calendar',
    isActive: false,
    calendarView: true
  }
];

export default Ember.Component.extend({
  organization: null,

  calendarViewFirst: computed.alias('organization.calendarViewFirst'),

  contentTabsSorted: computed('calendarViewFirst', function() {
    const firstTabName = get(this, 'calendarViewFirst') ? 'calendar' : 'posts';

    this._setActiveTab(firstTabName);

    return contentTabs.sort(a => {
      return a.name === firstTabName ? -1 : 1;
    });
  }),

  _setActiveTab(tabName) {
    contentTabs.forEach(contentTab => {
      set(contentTab, 'isActive', contentTab.name === tabName);
    });
  },

  actions: {
    setActiveTab(tabName) {
      this._setActiveTab(tabName);
      if (get(this, 'onTabChange')) {
        const activeTab = contentTabs.find(tab => { return tab.name === tabName; });
        get(this, 'onTabChange')(activeTab.calendarView);
      }
    }
  }
});
