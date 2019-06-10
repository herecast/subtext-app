//import EmberObject from '@ember/object';
import mockService from 'subtext-app/tests/helpers/mock-service';

export default function(cookies={}) {
  mockService('cookies',{
    read: (name) => {
      return cookies[name];
    },
    write: (name, value) => {
      cookies[name] = value;
    },
    clear: (name) => {
      delete cookies[name];
    }
  });
}
