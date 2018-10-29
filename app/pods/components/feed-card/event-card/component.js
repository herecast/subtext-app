import { reads, oneWay, alias, or } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import moment from 'moment';
import reloadComments from 'subtext-ui/mixins/reload-comments';

export default Component.extend(reloadComments, {
  classNames: 'FeedCard-EventCard',
  'data-test-event-card': reads('model.title'),
  'data-test-content': oneWay('model.contentId'),

  model: null,
  context: null,
  userLocation: service(),
  sourceTag: null,

  startTime: computed('model.startsAt', function() {
    const startsAt = get(this, 'model.startsAt');

    return isPresent(startsAt) ? moment(startsAt).format('h:mma') : null;
  }),

  endTime: computed('model.endsAt', function() {
    const endsAt = get(this, 'model.endsAt');

    return isPresent(endsAt) ? moment(endsAt).format('h:mma') : null;
  }),

  attributionLinkRouteName: computed('model.isOwnedByOrganization', function() {
    const shouldLinkToProfile = get(this, 'model.isOwnedByOrganization') && isPresent(get(this, 'model.organizationId'));

    return shouldLinkToProfile ? 'profile' : null;
  }),

  attributionLinkId: alias('model.organizationId'),

  sourceOrVenueTag: computed('sourceTag', 'model.{venueCity,venueState}', function() {
    const sourceTag = get(this, 'sourceTag');

    if (isPresent(sourceTag)) {
      return sourceTag;
    }

    if (isPresent(get(this, 'model.venueCity')) && isPresent(get(this, 'model.venueState'))) {
      return `${get(this, 'model.venueCity')}, ${get(this, 'model.venueState')}`;
    } else {
      return null;
    }
  }),

  hideComments: or('context.condensedView', 'context.hideComments'),

  actions: {
    onContentClick() {
      const onContentClick = get(this, 'context.onContentClick');
      if (onContentClick) {
        onContentClick();
      }
    },

    openPromotionMenu() {
      const openPromotionMenu = get(this, 'context.openPromotionMenu');
      if (openPromotionMenu) {
        openPromotionMenu();
      }
    }
  }

});
