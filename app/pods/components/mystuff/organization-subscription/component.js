import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  subscription: null,

  organizationId: oneWay('subscription.organizationId'),
  organizationName: oneWay('subscription.organizationName'),
  organizationProfileImageUrl: oneWay('subscription.organizationProfileImageUrl')
});
