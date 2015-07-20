export function initialize(container, application) {
  application.inject('component:event-form-dates', 'store', 'service:store');
  application.inject('component:event-comments-new', 'store', 'service:store');
  application.inject('service:session', 'store', 'service:store');
  application.inject('component:sign-in-link', "router", "router:main");
  application.inject('component:sign-in-link', "applicationController", "controller:application");
  application.inject('service:refresh-param', "applicationController", "controller:application");
}

export default {
  name: 'component-store-injection',
  after: 'store',
  initialize: initialize
};
