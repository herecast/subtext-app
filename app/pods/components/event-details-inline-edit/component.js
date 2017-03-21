import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Ember.Component.extend(TestSelector, {
  actions: {
    rollbackVenue(changeset) {
      delete changeset.get('changes')['venueId'];
      delete changeset.get('changes')['venueName'];
      delete changeset.get('changes')['venueAddress'];
      delete changeset.get('changes')['venueCity'];
      delete changeset.get('changes')['venueState'];
      delete changeset.get('changes')['venueZip'];
      delete changeset.get('changes')['venueUrl'];

      changeset.validate('venueId');
    },

    rollbackEventCost(changeset) {
      delete changeset.get('changes')['cost'];
      delete changeset.get('changes')['cost'];
    }
  }
});
