import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';

const { get } = Ember;

export default Ember.Route.extend(History, InfinityRoute, {
  queryParams: {
    organizationId: {refreshModel: true},
    type: {refreshModel: true},
    query: {refreshModel: true},
    page: {refreshModel: true}
  },

  model(params) {
    return this.controllerFor('mystuff').get('currentUser').then((currentUser) => {
      const currentUserId = get(currentUser, 'userId');

      return Ember.RSVP.hash({
        user: this.store.peekRecord('current-user', currentUserId),
        contents: this.infinityModel('user', {
          user_id: currentUserId,
          include: 'contents',
          organization_id: params.organizationId,
          query: params.query,
          content_type: params.type,
          modelPath: 'controller.model.contents',
          startingPage: params.page || 1
        })
      });

    });
  },

  actions: {
    loading(transition) {
      const controller = this.controllerFor('mystuff.contents');
      controller.set('isLoading', true);
      transition.promise.finally(() => {
        controller.set('isLoading', false);
      });
    }
  }
});
