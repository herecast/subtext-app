import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'FeedCard-Source',

  router: service(),
  tracking: service(),
  userLocationService: service('user-location'),

  model: null,

  customSize: 24,

  click() {
    const model = get(this, 'model');
    const location = get(model, 'location');

    get(this, 'tracking').trackTileOptionsMenuEvent('UserClicksSourceTag', get(model, 'contentId'));

    get(this, 'userLocationService').goToLocationFeed( get(location, 'id') );
  }
});
