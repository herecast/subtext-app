import { Promise } from 'rsvp';
import mockService from 'subtext-app/tests/helpers/mock-service';

export default function(shouldLoadPioneerFeed=false) {
  mockService('feed',{
    showPioneeringFeed: shouldLoadPioneerFeed,
    changeFeedModel(model) {
      return Promise.resolve(model);
    }
  });
}
