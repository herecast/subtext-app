import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Ember.Component.extend(TestSelector, {
  actions: {
    rollbackVenue(changeset) {
      const changes = changeset.get('changes');
      delete changes['venueId'];
      delete changes['venueName'];
      delete changes['venueAddress'];
      delete changes['venueCity'];
      delete changes['venueState'];
      delete changes['venueZip'];
      delete changes['venueUrl'];

      changeset.validate('venueId');
    },

    rollbackEventCost(changeset) {
      const changes = changeset.get('changes');
      delete changes['cost'];
      delete changes['costType'];
    }
  }
