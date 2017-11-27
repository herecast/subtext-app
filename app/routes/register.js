import Ember from 'ember';
import WillAuthenticateMixin from 'subtext-ui/mixins/routes/will-authenticate';

export default Ember.Route.extend(WillAuthenticateMixin, {
  titleToken: 'Join',

});
