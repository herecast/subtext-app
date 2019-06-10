import Route from '@ember/routing/route';
import WillAuthenticateMixin from 'subtext-app/mixins/routes/will-authenticate';

export default Route.extend(WillAuthenticateMixin, {
  titleToken: 'Join',

});
