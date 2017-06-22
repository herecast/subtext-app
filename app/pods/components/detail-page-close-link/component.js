import Ember from 'ember';
import DetailPageCloseMixin from 'subtext-ui/mixins/detail-page-close';

const { get, computed } = Ember;

export default Ember.Component.extend(DetailPageCloseMixin, {
  linkParams: computed('closeRoute', 'closeParams.[]', function(){
    const closeRoute = get(this, 'closeRoute');
    const closeParams = get(this, 'closeParams');

    const args = [].concat.apply(
      [closeRoute],
      closeParams
    );

    return args.compact();
  }),
});
