import { htmlSafe } from '@ember/template';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import formatPhone from 'subtext-ui/utils/format-phone';
import { isBlankOrEmptyHtmlTags } from 'subtext-ui/helpers/is-blank-or-empty-html-tags';

export default Component.extend({
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
    return htmlSafe("background-image: url(" + get(this, 'coverImage') + ")");
  }),

  detailsHTML: computed('model.details', function() {
    return htmlSafe(get(this, 'model.details'));
  }),

  isOpen: computed(function() {
    //placeholder for testing now vs times open
    return false;
  }),

  detailsAreBlank: computed('model.details', function() {
    return isBlankOrEmptyHtmlTags(get(this, 'model.details'));
  }),

  selectedLocation: computed('model.{name,phone,fullAddress,directionsLink}', 'model.coords.{lat,lng}', function() {
    const location = get(this, 'model');

    const phone = `<a href="tel:+1${get(location, 'phone')}" class="visible-xs-inline">`+
    `<i class="fa fa-phone"></i> ${formatPhone(get(location, 'phone'))}`+
    `</a><span class="hidden-xs"><i class="fa fa-phone"></i> ${formatPhone(get(location, 'phone'))}</span>`;

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
