import Ember from 'ember';
import DetailPageCloseMixin from 'subtext-ui/mixins/detail-page-close';

const { get } = Ember;

export default Ember.Controller.extend(DetailPageCloseMixin, {
  defaultCloseRoute: 'market',
  actions: {
    closeMarketDetailPage() {
      const closeRoute = get(this, 'closeRoute');
      const closeParams = get(this, 'closeParams');
      const args = ([].concat.apply(
        [closeRoute],
        closeParams
      )).compact();

      this.transitionToRoute(...args);
    }
  }
});
