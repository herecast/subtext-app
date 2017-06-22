import Ember from 'ember';
import sortByPublishedAt from 'subtext-ui/utils/sort-by-published-at';

const { computed } = Ember;

export default Ember.Component.extend({
  talks: [],
  sortedTalks: computed.sort('talks', sortByPublishedAt)
});
