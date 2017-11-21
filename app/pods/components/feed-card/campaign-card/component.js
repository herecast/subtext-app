import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-CampaignCard',
  'data-test-campaign-card': computed.reads('model.title'),

  model: null
});
