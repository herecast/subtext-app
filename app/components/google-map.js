import Ember from 'ember';

const {
  get,
  set,
  computed,
  isEmpty,
  isPresent,
  inject
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

  googleMapsService: inject.service('google-maps'),
  userLocation: null,
  defaultLocation: null,
  locations: null,
  markers: null,
  googleMapInstance: null,

  initGoogleMap() {
    const googleMapsService = get(this, 'googleMapsService').googleMaps;
    const $mapContainer      = this.$().find('.GoogleMap-embed');
    const defaultLocation   = get(this, 'defaultLocation');
    const userLocation      = get(this, 'userLocation');

    const googleMapInstance = new googleMapsService.maps.Map($mapContainer[0], {
      center: defaultLocation,
      mapTypeId: googleMapsService.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoom: 15 });

    set(this, 'googleMapInstance', googleMapInstance);

    if (userLocation) {
      googleMapInstance.setCenter(userLocation);
    }
  },

  infoWindow: computed(function() {
    const googleMapsService = get(this, 'googleMapsService').googleMaps;

    return new googleMapsService.maps.InfoWindow();
  }),

  buildMapMarkers(locations) {
    const googleMapsService = get(this, 'googleMapsService').googleMaps;
    const googleMapInstance  = get(this, 'googleMapInstance');
    const infoWindow = get(this, 'infoWindow');

    if (!isEmpty(locations)) {
      const markers = get(this, 'locations').map((location) => {
        return new googleMapsService.maps.Marker({
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
    const googleMapsService = get(this, 'googleMapsService').googleMaps;
    const LatLngBounds = new googleMapsService.maps.LatLngBounds();

    markers.forEach(marker => {
      return LatLngBounds.extend(marker.position);
    });

    return LatLngBounds;
  },

  zoomMap(LatLngBounds, googleMap) {
    const googleMapsService = get(this, 'googleMapsService').googleMaps;
    // Don't zoom in too far on only one marker
    const offset = 0.002;

    const extendPoint1 = new googleMapsService.maps.LatLng(
      LatLngBounds.getNorthEast().lat() + offset,
      LatLngBounds.getNorthEast().lng() + offset);

    const extendPoint2 = new googleMapsService.maps.LatLng(
      LatLngBounds.getNorthEast().lat() - offset,
      LatLngBounds.getNorthEast().lng() - offset);

    LatLngBounds.extend(extendPoint1);
    LatLngBounds.extend(extendPoint2);

    googleMap.fitBounds(LatLngBounds);
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

  didInsertElement() {
    this.initGoogleMap();
    this.updateMap();
  },

  didUpdateAttrs() {
    this._super();
    set(this, 'locations', get(this, 'locations'));
    this.updateMap();
  }
});
