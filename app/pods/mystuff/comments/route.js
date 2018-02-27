import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";
import History from 'subtext-ui/mixins/routes/history';

export default Ember.Route.extend(History, InfinityRoute, {
  queryParams: {
    page: {refreshModel: true}
  },

  model(params) {
    const currentUserId = this.controllerFor('mystuff').get('currentUserId');

    return Ember.RSVP.hash({
      user: this.store.peekRecord('current-user', currentUserId),
      comments: this.infinityModel('user', {
        user_id: currentUserId,
        include: 'comments',
        modelPath: 'controller.model.comments',
        startingPage: params.page || 1
      })
    });
  },
});
