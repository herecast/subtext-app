import { oneWay, alias } from '@ember/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: 'FeedCarousel-ContentCard',
  'data-test-feed-carousel-card': oneWay('model.contentType'),

  model: null,
  carouselId: null,
  linkIsActive: true,

  tracking: service(),

  title: alias('model.title'),

  body: alias('model.content'),

  actions: {
    onLinkClick(elementName) {
      get(this, 'tracking').trackCarouselCardClickEvent(elementName, get(this, 'carouselId'), get(this, 'model.id'));
    }
  }
});
