import Ember from 'ember';
import mockService from 'subtext-ui/tests/helpers/mock-service';

export default function(application, cookies={}) {
  mockService(application, 'cookies', Ember.Object.extend({
    read(name) {
      return cookies[name];
    },
    write(name, value){
      cookies[name] = value;
    }
  }));
}
