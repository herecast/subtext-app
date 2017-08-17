import Ember from 'ember';

const { set } = Ember;

export default Ember.Component.extend({
  classNames: 'Feed-ModelAutoLoader',

  infinityModel: null,

  infiniteScrollIsActive: false,
  infinityLoadAction: 'infinityLoad',
  isFirstInfinityLoad: true,
  lastPageLoaded: 0,

  actions: {
    startInfiniteScroll() {
      set(this, 'infiniteScrollIsActive', true);
      this.sendAction('seeMoreButtonClicked');
    },

    infinityLoad(infinityModel) {
      this.sendAction('infinityLoadAction', infinityModel);
    }
  }
});
