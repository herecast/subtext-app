import { reads } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'FeedCard-CampaignCard',
  'data-test-campaign-card': reads('model.title'),

  model: null
});
