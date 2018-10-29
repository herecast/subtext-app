import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import History from 'subtext-ui/mixins/routes/history';

export default Route.extend(History, {
  infinity: service(),

  queryParams: {
    page: {refreshModel: true}
  },

  model(params) {
    const currentUserId = this.controllerFor('mystuff').get('currentUserId');

    return this.infinity.model('user', {
      user_id: currentUserId,
      include: 'contents',
      bookmarked: true,
      modelPath: 'controller.model',
      startingPage: params.page || 1
    });
  },
});
