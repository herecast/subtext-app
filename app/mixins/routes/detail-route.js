import { get, setProperties } from '@ember/object';
import { isBlank, isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import RouteMetaMixin from 'subtext-app/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-app/mixins/routes/title-token-from-content';
import FastbootTransitionRouteProtocol from 'subtext-app/mixins/routes/fastboot-transition-route-protocol';
import Mixin from '@ember/object/mixin';

export default Mixin.create(FastbootTransitionRouteProtocol, RouteMetaMixin, DocTitleFromContent, {
  _defaultParentModelPath: 'feed',

  session: service(),
  store: service(),
  modals: service(),
  fastboot: service(),
  userLocationService: service('user-location'),

  model(params)  {
    return get(this, 'store').findRecord('content', params.id, { reload: true });
  },

  afterModel(model, transition) {
    const contentType = get(model, 'contentType');
    const thisIsNotAnInstanceRoute = this.routeName.indexOf('-instance') < 0;

    if (contentType === 'event') {
      const targetName = transition.targetName;
      const params = transition.params[targetName];
      const eventInstanceId = params.event_instance_id || get(model, 'eventInstanceId') || false;

      if (thisIsNotAnInstanceRoute && eventInstanceId) {
        this.transitionTo(`${get(this, '_defaultParentModelPath')}.show-instance`, get(model, 'id'), eventInstanceId);
      } else {
        const eventInstances = get(model, 'eventInstances');

        const thisInstance = eventInstances.find(instance => {
          return parseInt(get(instance, 'id')) === parseInt(eventInstanceId);
        });

        if (isPresent(thisInstance)) {
          setProperties(model, {
            'startsAt': get(thisInstance, 'startsAt'),
            'endsAt': get(thisInstance, 'endsAt')
          });
        }
      }
    }
    this._super(model);
  },

  loadFeedInParent() {
    //This is to delay load of the feed until after load of integrated detail
    //to speed up first page load speed
    const parentModel = this.modelFor(get(this, '_defaultParentModelPath'));

    if (!get(this, 'fastboot.isFastBoot') && isBlank(parentModel)) {
      const contentLocationId = this.modelFor(this.routeName).get('locationId');

      if (!get(this, 'session.isAuthenticated')) {
        get(this, 'userLocationService').setActiveUserLocationWithoutSaving(contentLocationId);
      }

      this.send('loadFeedFromElsewhere', contentLocationId);
    }

  },

  actions: {
    didTransition() {
      this._super(...arguments);

      const parentController = this.controllerFor(get(this, '_defaultParentModelPath'));
      const contentId = this.modelFor(this.routeName).get('contentId');

      if (get(this, '_defaultParentModelPath') === 'feed') {
        parentController.trackDetailPageViews(contentId);
      }

      this.loadFeedInParent();

      return true;
    }
  }
});
