import Ember from 'ember';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';
import ResetScroll from 'subtext-ui/mixins/routes/reset-scroll';

export default Ember.Route.extend(MaintainScroll, ResetScroll, {
  activate() {
    const searchController = this.controllerFor('directory.search');

    searchController.set('selectedResult', null);
  }
});
