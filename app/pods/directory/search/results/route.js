import Ember from 'ember';
import MaintainScroll from 'subtext-ui/mixins/routes/maintain-scroll';

export default Ember.Route.extend(MaintainScroll, {
  activate() {
    const searchController = this.controllerFor('directory.search');

    searchController.set('selectedResult', null);
  }
});
