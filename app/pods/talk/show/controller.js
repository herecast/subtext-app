import Ember from 'ember';
import DetailPageCloseMixin from 'subtext-ui/mixins/detail-page-close';

const { get } = Ember;

export default Ember.Controller.extend(DetailPageCloseMixin, {
  queryParams: ['ctype', 'scrollTo'],
  scrollTo: null,
  ctype: 'talk',
  defaultCloseRoute: 'talk',

  displayPromotion: true,

  actions: {
    closeTalkDetailPage() {
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
