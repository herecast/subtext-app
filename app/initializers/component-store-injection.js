export function initialize(application) {
  application.inject('component:event-form-dates', 'store', 'service:store');
  application.inject('component:comment-new', 'store', 'service:store');
  application.inject('service:user', 'store', 'service:store');
  application.inject('service:content-comments', 'store', 'service:store');
  application.inject('service:content-model', 'store', 'service:store');
}

export default {
  name: 'component-store-injection',
  initialize: initialize
};
