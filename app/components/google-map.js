import Ember from 'ember';

const {
  get,
  set,
  computed,
  isEmpty,
  isPresent,
  inject:{service},
  RSVP:{Promise}
} = Ember;

export default Ember.Component.extend({
  classNames: ['GoogleMap'],

  useMapOverlay: computed(function() {
    // The overlay requires a click before the user can pan or
    // scroll the map. This helps usability on touchscreens.
    const media = get(this, 'media');

    if (isPresent(media)) {
      const { isMobile, isTablet } = get(this, 'media');

      return (isMobile || isTablet);
    }
  }),

  googleMapsService: service('google-maps'),
  googleMaps: null,
  googleMapInstance: null,

  userLocation: null,
  defaultLocation: null,
  locations: null,
  markers: null,

  didInsertElement() {
    this.initGoogleMap().then(() => {
      this.updateMap();
    });
  },

  didUpdateAttrs() {
    this._super();
    set(this, 'locations', get(this, 'locations'));
    this.updateMap();
  },

  initGoogleMap() {
    return get(this, 'googleMapsService').getGoogleMaps().then(googleMaps => {
      set(this, 'googleMaps', googleMaps);
      const $mapContainer     = this.$().find('.GoogleMap-embed');
      const defaultLocation   = get(this, 'defaultLocation');
      const userLocation      = get(this, 'userLocation');

      const googleMapInstance = new googleMaps.Map($mapContainer[0], {
        center: defaultLocation,
        mapTypeId: googleMaps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoom: 15 });

      set(this, 'googleMapInstance', googleMapInstance);

      if (userLocation) {
        googleMapInstance.setCenter(userLocation);
      }

      return Promise.resolve();
    });
  },

  updateMap() {
    const googleMapInstance = get(this, 'googleMapInstance');
    const locations = get(this, 'locations') || [];
    let newMapMarkers;
    let newLatLngBounds;

    this.removeOldMapMarkers();

    newMapMarkers = this.buildMapMarkers(locations) || [];
    newLatLngBounds = this.getBounds(newMapMarkers);

    this.placeMapMarkers(newMapMarkers, googleMapInstance);
    this.zoomMap(newLatLngBounds, googleMapInstance);
  },

  infoWindow: computed(function() {
    const googleMaps = get(this, 'googleMaps');

    return new googleMaps.InfoWindow();
  }),

  buildMapMarkers(locations) {
    const googleMaps = get(this, 'googleMaps');
    const googleMapInstance  = get(this, 'googleMapInstance');
    const infoWindow = get(this, 'infoWindow');

    if (!isEmpty(locations)) {
      const markers = get(this, 'locations').map((location) => {
        return new googleMaps.Marker({
          position: location.coords,
          title: location.title,
          infoWindowContent: location.content
        });
      });

      markers.forEach((marker) => {
        return marker.addListener('click', function() {
          infoWindow.close();
          infoWindow.setContent(this.infoWindowContent);
          infoWindow.open(googleMapInstance, this);
        });
      });

      set(this, 'markers', markers);

      return markers;
    }
  },

  placeMapMarkers(markers, map) {
    return markers.forEach(marker => {
      marker.setMap(map);
    });
  },

  removeOldMapMarkers() {
    const markersToDestroy = get(this, 'markers') || [];
    set(this, 'markers', []);

    return markersToDestroy.forEach(marker => {
      marker.setMap(null);
    });
  },

  getBounds(markers) {
    const googleMaps = get(this, 'googleMaps');
    const LatLngBounds = new googleMaps.LatLngBounds();

    markers.forEach(marker => {
      return LatLngBounds.extend(marker.position);
    });

    return LatLngBounds;
  },

  zoomMap(LatLngBounds, googleMapInstance) {
    const googleMaps = get(this, 'googleMaps');
    // Don't zoom in too far on only one marker
    const offset = 0.002;

    const extendPoint1 = new googleMaps.LatLng(
      LatLngBounds.getNorthEast().lat() + offset,
      LatLngBounds.getNorthEast().lng() + offset);

    const extendPoint2 = new googleMaps.LatLng(
      LatLngBounds.getNorthEast().lat() - offset,
      LatLngBounds.getNorthEast().lng() - offset);

    LatLngBounds.extend(extendPoint1);
    LatLngBounds.extend(extendPoint2);

    googleMapInstance.fitBounds(LatLngBounds);
  }
});
