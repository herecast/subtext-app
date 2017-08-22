import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard',
  classNameBindings: ['isEditing:show-back', 'showOverlay:show-overlay'],
  attributeBindings: ['data-test-feed-card'],
  'data-test-feed-card': computed.oneWay('model.normalizedContentType'),

  model: null,

  session: service(),
  userLocation: service('userLocation'),

  isLoggedIn: computed.alias('session.isAuthenticated'),

  contentType: computed.alias('model.normalizedContentType'),

  componentType: computed('contentType', function() {
    const contentType = get(this, 'contentType');

    return `feed-card/${contentType}-card`;
  })
});
