import Ember from 'ember';
import formatPhone from 'subtext-ui/utils/format-phone';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryBusiness'],
  model: null,

  coverImages: computed('model.images', function(){
    return get(this, 'model.images');
  }),
  //when we allow multiple images, this setup will allow for slideshow between images
  coverImageIndex:0,

  init() {
    this._super();
  },

  coverImage: computed('coverImageIndex', function(){
    return get(this, 'coverImages').objectAt( get(this,'coverImageIndex') );
  }),

  coverImageStyle: computed('coverImage', function() {
    return new Ember.String.htmlSafe("background-image: url(" + get(this, 'coverImage') + ")");
  }),

  detailsHTML: computed('model.details', function() {
    return new Ember.String.htmlSafe( get(this, 'model.details'));
  }),

  isOpen: computed(function() {
    //placeholder for testing now vs times open
    return false;
  }),

  selectedLocation: computed('media.isMobile', 'model.name', 'model.phone', 'model.fullAddress', 'model.directionsLink', 'model.coords.lat', 'model.coords.lng', function() {
    const location = get(this, 'model');
    const isMobile = get(this, 'media.isMobile');

    const phone = (isMobile) ?
    `<a href="tel:+1${get(location, 'phone')}">`+
    `<i class="fa fa-phone"></i> ${formatPhone(get(location, 'phone'))}`+
    `</a>` : `<i class="fa fa-phone"></i> ${formatPhone(get(location, 'phone'))}`;

    return [{
      coords: {
        lat: parseFloat(get(location, 'coords.lat')),
        lng: parseFloat(get(location, 'coords.lng'))
      },
      title: get(location, 'name'),
      content: `<h2>${get(location, 'name')}</h2>
      <div><i class="fa fa-map-marker"></i> ${get(location, 'fullAddress')}</div>
      <div>${phone}</div><div><a href="${get(location, 'directionsLink')}" target="_blank"><i class="fa fa-automobile"></i> Directions</a></div>`
    }];
  }),
});
