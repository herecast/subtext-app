import Ember from 'ember';
import { optimizedImageUrl } from 'subtext-ui/helpers/optimized-image-url';

const { get, computed, String:{htmlSafe}, isPresent, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCarousel-OrganizationCard',
  classNameBindings: ['profileImageUrl:has-profile-image'],

  model: null,
  carouselId: null,

  tracking: service(),

  linkRouteName: computed.alias('model.organizationLinkRoute', function() {
    const linkRouteName = get(this, 'model.organizationLinkRoute');

    return linkRouteName || 'feed.show';
  }),

  linkRouteId: computed('model.organizationLinkId', function() {
    const linkRouteId = get(this, 'model.organizationLinkId');

    return linkRouteId ||  get(this, 'model.id');
  }),

  backgroundImageUrl: computed.alias('model.backgroundImageUrl'),
  backgroundImageStyle: computed('backgroundImageUrl', function() {
    const backgroundImageUrl = get(this, 'backgroundImageUrl');

    if (isPresent(backgroundImageUrl)) {
      const options = [backgroundImageUrl, 300, 200, true];
      return htmlSafe(`background-image: url('${optimizedImageUrl(options)}');`);
    }

    return '';
  }),

  profileImageUrl: computed('model.profileImageUrl', function() {
    const profileImageUrl = get(this, 'model.profileImageUrl');

    if (isPresent(profileImageUrl)) {
      const options = [profileImageUrl, 100, 100, true];
      return optimizedImageUrl(options);
    }

    return '';
  }),

  orgName: computed.alias('model.name'),
  cityState: computed('model.{city,state}', function() {
    const city = get(this, 'model.city');
    const state = get(this, 'model.state');
    let cityState = [];

    if (isPresent(city)) {
      cityState.push(city);
    }

    if (isPresent(state)) {
      cityState.push(state);
    }

    return cityState.join(', ');
  }),
  phone: computed.alias('model.phone'),
  email: computed.alias('model.email'),
  directionsLink: computed.alias('model.directionsLink'),
  emailLink: computed.alias('model.emailLink'),
  isNotClaimed: computed('model.claimed', 'model.orgType', function() {
    return !get(this, 'model.claimed') && get(this, 'model.orgType').toLowerCase() === 'business';
  }),

  claimEmail: computed(function() {
      const mailTo = `mailto:dailyuv@subtext.org`;
      const firstLine = 'Thank you for claiming this business. Please provide the following information:';
      const emailBody = `
  Your name:
  Your affiliation with this business:
  Your business’s name if different from what you see in the subject line above:

  We’ll need to speak with you by telephone to verify your affiliation with this business and check the information in the listing.
  If the directory already contains a phone number for this business, that is where we’ll call you.
  If there’s no phone number listed, or if the one listed is wrong, please add it here:

  Thanks again for helping us build the Upper Valley’s best website, DailyUV!`;

      const body = `${encodeURIComponent(firstLine)}%0D%0A%0D%0A${encodeURIComponent(emailBody)}`;

      return `${mailTo}?subject=Claiming ${encodeURIComponent(get(this, 'model.name'))}%20${get(this, 'model.id')}&body=${body}`;
  }),

  actions: {
    onLinkClick(elementName) {
      get(this, 'tracking').trackCarouselCardClickEvent(elementName, get(this, 'carouselId'), get(this, 'model.id'));
    }
  }
});