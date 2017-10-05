import Ember from 'ember';

const { get, computed, inject:{service} } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard',
  classNameBindings: ['isEditing:show-back', 'showOverlay:show-overlay'],
  'data-test-feed-card': computed.oneWay('model.normalizedContentType'),
  'data-test-content': computed.oneWay('model.contentId'),

  model: null,

  session: service(),
  userLocation: service('userLocation'),

  isLoggedIn: computed.alias('session.isAuthenticated'),

  contentType: computed.reads('model.normalizedContentType'),

  componentType: computed('contentType', function() {
    const contentType = get(this, 'contentType');

    return `feed-card/${contentType}-card`;
  })
});
