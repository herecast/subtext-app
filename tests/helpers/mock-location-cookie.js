import CookiesService from 'subtext-ui/services/cookies';
import mockService from 'subtext-ui/tests/helpers/mock-service';

export default function(application, location=null) {
  if (!location) {
    location = server.create('location');
  }

  const cookies = CookiesService.extend({
    read(name) {
      if(name === 'locationId') {
        return location.id;
      } else if (name === 'locationConfirmed') {
        return true;
      } else {
        return this._super(...arguments);
      }
    }
  });

  mockService(application, 'cookies', cookies);

  return location;
}
