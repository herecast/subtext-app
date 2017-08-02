import Ember from 'ember';
import Listservs from '../../../mixins/routes/listservs';
import DocTitleFromContent from '../../../mixins/routes/title-token-from-content';

const {
  get,
  RSVP,
  inject
} = Ember;

export default Ember.Route.extend(Listservs, DocTitleFromContent, {
  api: inject.service(),
  userLocation: inject.service(),
  additionalToken: 'Promote',

  model() {
    const model = this.modelFor('events.new');

    return new RSVP.Promise((resolve) => {
      const venueId = get(model, 'venueId');

      if (venueId) {
        get(this, 'api').getVenueLocation(venueId).then((data) => {
          const location = this.store.push(this.store.normalize('location', data.location));

          if(location.id) {
            return location;
          } else {
            return get(this, 'userLocation.location');
          }
        }, ()=>{
          return get(this, 'userLocation.location');
        }).then((location) => {
          get(model, 'contentLocations').addObject(
            this.store.createRecord('content-location', {
              locationType: 'base',
              locationId: location.id,
              location: location
            })
          );

          resolve(model);
        }).catch(() => {
          resolve(model);
        });
      } else {
        resolve(model);
      }
    });
  }
});
