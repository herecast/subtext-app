import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Footer',

  locationTagName: null,
  canEdit: false,
  commentCount: 0,

  hasSource: computed.notEmpty('locationTagName'),
  hasComments: computed.gt('commentCount', 0)
});
