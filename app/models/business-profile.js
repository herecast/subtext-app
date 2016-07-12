import Ember from 'ember';
import DS from 'ember-data';

const { computed, get } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  phone: DS.attr('string'),
  website: DS.attr('string'),
  websiteLink: computed('website', function() {
    let siteLink = get(this, 'website');
    if( siteLink.match(`^(http|https)://`) === null ){
        siteLink = "http://" + siteLink;
    }
    return siteLink;
  }),
  hours: DS.attr('raw', { defaultValue: () => { return []; }}),
  email: DS.attr('string'),
  address: DS.attr('string'),
  city: DS.attr('string'),
  state: DS.attr('string'),
  zip: DS.attr('string'),
  fullAddress: computed('address', 'city', 'state', 'zip', function() {
    const address = this.get('address');
    const city = this.get('city');
    const state = this.get('state');

    return `${address}, ${city}, ${state}`;
  }),
  directionsLink: computed('fullAddress', function() {
    const addressLink = get(this,'fullAddress') + "," + get(this,'zip');
    return 'http://maps.google.com/?q=' + encodeURIComponent( addressLink );
  }),
  coords: DS.attr(),
  service_radius: DS.attr('number'),
  milesFromUser: computed('coords', function() {
    //@todo inject location service
    return '(00.0 mi)';
  }),
  details: DS.attr('string'),
  logo: DS.attr('string'),
  images: DS.attr('raw', { defaultValue: () => { return []; }}),
  feedback: DS.attr(),
  feedback_num: DS.attr('number'),
  has_retail_location: DS.attr('boolean'),
  views: DS.attr('number'),
  can_edit: DS.attr('boolean'),
  has_rated: DS.attr('boolean'),

  organization_id: DS.attr('number'), //To be replaced by relationship
  categories: DS.hasMany('business-category', {async: true})
});
