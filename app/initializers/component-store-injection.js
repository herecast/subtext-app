export function initialize(container, application) {
  application.inject('component:event-form-dates', 'store', 'store:main');
  application.inject('component:event-comments-new', 'store', 'store:main');
}

export default {
  name: 'component-store-injection',
  after: 'store',
  initialize: initialize
};
