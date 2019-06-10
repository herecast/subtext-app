import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import History from 'subtext-app/mixins/routes/history';

export default Route.extend(History, {
  infinity: service(),

  queryParams: {
    organizationId: {refreshModel: true},
    type: {refreshModel: true},
    query: {refreshModel: true},
    page: {refreshModel: true}
  },

  model(params) {
    return this.controllerFor('mystuff').get('currentUser').then((currentUser) => {
      const currentUserId = get(currentUser, 'userId');

      return this.infinity.model('user', {
          user_id: currentUserId,
          include: 'contents',
          organization_id: params.organizationId,
          query: params.query,
          content_type: params.type,
          modelPath: 'controller.model',
          startingPage: params.page || 1
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
