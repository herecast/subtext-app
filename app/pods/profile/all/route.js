import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';

const {get, set, inject} = Ember;

export default Ember.Route.extend(InfinityRoute, History, {
  session: inject.service(),
  fastboot: inject.service(),

  queryParams: {
    page: {refreshModel: true},
    query: {refreshModel: true},
    show: {refreshModel: true},
  },

  _redirectToPublicView() {
    return this.replaceWith(this.routeName, {
      queryParams: {
        show: null
      }
    });
  },

  _getOrganizationId() {
    const profileParams = this.paramsFor('profile');
    return profileParams.organization_id;
  },

  beforeModel() {
    const params = this.paramsFor(this.routeName);

    // Redirect the user if they do not have access to view this content
    if ('show' in params && params.show && !get(this, 'fastboot.isFastBoot')) {
      if (get(this, 'session.isAuthenticated')) {
        return get(this, 'session.currentUser').then(currentUser => {
          if (!(currentUser && currentUser.isManagerOfOrganizationID(this._getOrganizationId()))) {
            return this._redirectToPublicView();
          }
        });
      } else {
        return this._redirectToPublicView();
      }
    }
  },

  model(params) {
    // Do not attempt to render content in fastboot if we need to first determine if user has access to it
    const hideContent = ('show' in params && params.show && get(this, 'fastboot.isFastBoot'));

    return hideContent ? [] : this.infinityModel('feed-content', {
        startingPage: params.page,
        perPage: 20,
        organization_id: this._getOrganizationId(),
        query: params.query,
        show: params.show
      });
  },

  setupController(controller, model) {
    this._super(controller, model);
    set(controller, 'organization', this.modelFor('profile'));
  }
});
