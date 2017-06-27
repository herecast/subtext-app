/* global dataLayer */
import Ember from 'ember';

const {
  Evented,
  Service,
  computed,
  inject,
  assign,
  get
} = Ember;

export default Service.extend(Evented, {
  session: inject.service(),
  userLocation: inject.service(),
  clientId: computed.alias('session.clientId'),
  locationId: computed.alias('userLocation.locationId'),

  defaultDataLayerAttrs: computed('locationId', 'clientId', function() {
    return {
      client_id: get(this, 'clientId'),
      location_id: get(this, 'locationId')
    };
  }),

  /**
   * by default pushes into dataLayer/GTM
   */
  push(options) {
    const trackData = assign(
      {}, get(this, 'defaultDataLayerAttrs'), options
    );

    if(typeof(dataLayer) !== "undefined") {
      dataLayer.push(trackData);
    }

    this.trigger(trackData.event, trackData);
  }
});
