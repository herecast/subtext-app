export function initialize(application) {
   application.inject('route', 'tracking', 'service:tracking');
   application.inject('controller', 'tracking', 'service:tracking');
   application.inject('component', 'tracking', 'service:tracking');
}

export default {
  name: 'tracking',
  initialize
};
