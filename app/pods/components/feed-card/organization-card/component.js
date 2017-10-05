import Ember from 'ember';

const {computed} = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-OrganizationCard',
  model: null,
  organization: computed.oneWay('model.organization'),

  willExpandDescription: false,
  isDescriptionExpanded: false,

  actions: {
    toggleDescription() {
      this.toggleProperty('isDescriptionExpanded');
    }
  }
});
