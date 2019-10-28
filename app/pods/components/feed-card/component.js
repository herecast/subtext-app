import { oneWay, alias, readOnly, reads } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { observer } from '@ember/object';
import CardMetrics from 'subtext-app/mixins/components/card-metrics';

export default Component.extend(CardMetrics, {
  classNames: 'FeedCard',
  classNameBindings: ['isEditing:show-back', 'showOverlay:show-overlay', 'promotionMenuOpen:promotion-menu-open'],
  'data-test-feed-card': oneWay('model.contentType'),
  'data-test-content': oneWay('model.contentId'),
  'data-test-entered-viewport': oneWay('_didEnterViewPort'),

  model: null,

  hideComments: false,
  showAnyViewCount: false,
  linkToDetailIsActive: true,

  hideCompletely: false,

  session: service(),
  userLocation: service('userLocation'),
  tracking: service(),

  isLoggedIn: alias('session.isAuthenticated'),
  isDraft: readOnly('model.isDraft'),
  cardSize: oneWay('session.cardSize'),

  contentType: reads('model.contentType'),
  componentType: computed('cardSize', function() {
    const cardSize = get(this, 'cardSize');//fullsize, midsize, compact

    return `feed-card/${cardSize}-card`;
  }),

  isHiddenFromFeed: readOnly('model.isHiddenFromFeed'),
  hideFromFeedWatcher: observer('isHiddenFromFeed', function() {
    if (get(this, 'isHiddenFromFeed')) {
      later(() => {
        set(this, 'hideCompletely', true);
      }, 1000);
    }
  })
});
