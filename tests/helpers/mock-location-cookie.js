import mockService from 'subtext-app/tests/helpers/mock-service';

export default function(server, location=null) {
  if (!location) {
    location = server.create('location');
  }

  mockService('cookies', {
    read: (name) => {
      if (name === 'userLocationId') {
        return location.id;
      } else {
        return null;
      }
    },
    write: (name, value) => {
      return value;
    }
  });

  return location;
}
