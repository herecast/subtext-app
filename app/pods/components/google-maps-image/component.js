import Ember from 'ember';
import config from 'subtext-ui/config/environment';
import qs from 'npm:qs';

const {get, getProperties, computed, isPresent} = Ember;

/**
 * Component for rendering a static Google Maps image.
 *
 * @see https://developers.google.com/maps/documentation/static-maps
 * @see `google-map` component if you want a heavier but more interactive Google Maps component.
 */
export default Ember.Component.extend({
  tagName: 'img',
  attributeBindings: ['src'],

  markers: [],

  /**
   * Any one of the given properties may be added.
   *
   * @param center - Required if `markers` not present. The location of the map.
   * @param markers - Required if not using center. Define one or more markers to attach to the image at specified locations
   * @param zoom - Required. The zoom level of the map.
   * @param size - Required. The requested dimensions of the image.

   * @param path (optional) defines a single path of two or more connected points to overlay on the image at specified locations.
   * @param visible (optional) specifies one or more locations that should remain visible on the map, though no markers or other indicators will be displayed.
   * @param scale (optional) Multiplies the num pixels returned. Eg. scale=2 is twice as big.
   * @param format (optional) Image format to return. Default is PNG.
   * @param maptype (optional) May be one of roadmap, satellite, hybrid, and terrain
   * @param language (optional) Language for labels on the map.
   * @param region (optional) Defines the appropriate borders to display, based on geo-political sensitivities.
   *
   * @see https://developers.google.com/maps/documentation/static-maps/intro
   */
  src: computed('markers', 'center', 'zoom', 'size', 'maptype', 'path', 'visible', 'scale', 'format', 'language', 'region', 'markerStyles', function () {
    const params = getProperties(this, 'markers', 'center', 'zoom', 'size', 'maptype', 'path', 'visible', 'scale', 'format', 'language', 'region');

    if (isPresent(params.markers)) {
      params.markers = get(this, 'markerStyles').concat(params.markers).join('|');
    }

    params.key = config.GMAPS_API_TOKEN;

    return `https://maps.googleapis.com/maps/api/staticmap?${qs.stringify(params)}`;
  }),

  /**
   * Styling for markers on the map.
   *
   * @param markerSize (optional) specifies the size of marker from the set {tiny, mid, small}
   * @param markerColor (optional) specifies a color
   * @param markerLabel (optional) specifies a single uppercase alphanumeric character from the set {A-Z, 0-9}.
   *
   * @see https://developers.google.com/maps/documentation/static-maps/intro#Markers
   */
  markerStyles: computed('markerSize', 'markerColor', 'markerLabel', function() {
    const markerStyles = [];
    const size = get(this, 'markerSize'),
      color = get(this, 'markerColor'),
      label = get(this, 'markerLabel');

    if (isPresent(size)) {
      markerStyles.push(`size:${size}`);
    }

    if (isPresent(color)) {
      markerStyles.push(`color:${color}`);
    }

    if (isPresent(label)) {
      markerStyles.push(`label:${label}`);
    }

    return markerStyles;
  })
});
