export function initialize(container, application) {
  application.inject('component:event-form-dates', 'store', 'store:main');
  application.inject('component:event-comments-new', 'store', 'store:main');
  application.inject('service:session', 'store', 'store:main');
  application.inject('component:sign-in-link', "router", "router:main");
  application.inject('component:sign-in-link', "applicationController", "controller:application");
}

export default {
  name: 'component-store-injection',
  after: 'store',
  initialize: initialize
};
