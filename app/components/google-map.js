import Ember from 'ember';
/* global google */

const {
  get,
  set,
  computed,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  classNames: ['GoogleMap'],

  userLocation: null,
  defaultLocation: null,
  locations: null,
  markers: null,
  googleMap: null,

  initGoogleMap() {
    const mapContainer = Ember.$('.GoogleMap-embed');
    const defaultLocation = get(this, 'defaultLocation');
    const userLocation = get(this, 'userLocation');

    if (typeof google !== 'undefined') {
      const googleMap = new google.maps.Map(mapContainer[0], {
        center: defaultLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoom: 15 });

      set(this, 'googleMap', googleMap);

      if (userLocation) {
        googleMap.setCenter(userLocation);
      }
    }
  },

  infoWindow: computed(() => {
    return new google.maps.InfoWindow();
  }),

  buildMapMarkers(locations) {
    const googleMap  = get(this, 'googleMap');
    const infoWindow = get(this, 'infoWindow');

    if (!isEmpty(locations)) {
      const markers = get(this, 'locations').map((location) => {
        return new google.maps.Marker({
          position: location.position,
          title: location.title,
          infoWindowContent: location.content
        });
      });

      markers.forEach((marker) => {
        return marker.addListener('click', function() {
          infoWindow.close();
          infoWindow.setContent(this.infoWindowContent);
          infoWindow.open(googleMap, this);
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
    const LatLngBounds = new google.maps.LatLngBounds();

    markers.forEach(marker => {
      return LatLngBounds.extend(marker.position);
    });

    return LatLngBounds;
  },

  zoomMap(LatLngBounds, googleMap) {
    // Don't zoom in too far on only one marker
    const offset = 0.005;

    const extendPoint1 = new google.maps.LatLng(
      LatLngBounds.getNorthEast().lat() + offset,
      LatLngBounds.getNorthEast().lng() + offset);

    const extendPoint2 = new google.maps.LatLng(
      LatLngBounds.getNorthEast().lat() - offset,
      LatLngBounds.getNorthEast().lng() - offset);

    LatLngBounds.extend(extendPoint1);
    LatLngBounds.extend(extendPoint2);

    googleMap.fitBounds(LatLngBounds);
  },

  updateMap() {
    const googleMap = get(this, 'googleMap');
    const locations = get(this, 'locations') || [];
    let newMapMarkers;
    let newLatLngBounds;

    this.removeOldMapMarkers();

    newMapMarkers = this.buildMapMarkers(locations) || [];
    newLatLngBounds = this.getBounds(newMapMarkers);

    this.placeMapMarkers(newMapMarkers, googleMap);
    this.zoomMap(newLatLngBounds, googleMap);
  },

  didInsertElement() {
    this.initGoogleMap();
    this.updateMap();
  },

  didUpdateAttrs() {
    set(this, 'locations', this.attrs.locations.value);
    this.updateMap();
  }
});
