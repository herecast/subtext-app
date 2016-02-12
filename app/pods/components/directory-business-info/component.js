import Ember from 'ember';

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

  fullPhone: computed('model.phone', function(){
    return get(this, 'model.phone'). formattedPhone();
  }),

  directionsLink: computed('model.fullAddress', function(){
    return 'http://maps.google.com/?q=' + encodeURIComponent( get(this,'model.fullAddress') + "," + get(this,'model.zip') );
  }),

  websiteLink: computed('model.website', function(){
    let website = get(this, 'model.website');

    if( website.match(`^(http|https)://`) === null ){
        website = "http://"+website;
    }
    return website;
  }),

  isOpen: computed(function() {
    //placeholder for testing now vs times open
    return false;
  })
});
