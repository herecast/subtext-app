export function initialize(container, application) {
   application.inject('route', 'session', 'service:session');
   application.inject('controller', 'session', 'service:session');
   application.inject('component', 'session', 'service:session');
}

export default {
  name: 'session',
  initialize
};
