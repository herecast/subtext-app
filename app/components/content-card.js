import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['missingContent:hidden'],
  missingContent: Ember.computed.empty('item'),

  showLink: true,
  isSimilarContent: false,
  isNews: Ember.computed.equal('item.contentType', 'news'),
  isTalk: Ember.computed.equal('item.contentType', 'talk'),
  isMarketPost: Ember.computed.equal('item.contentType', 'market-post'),
  isEventInstance: Ember.computed.equal('item.contentType', 'event-instance')
});
