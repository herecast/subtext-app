import Ember from 'ember';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';
import ajax from 'ic-ajax';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from '../mixins/routes/history';

const { inject, get, RSVP } = Ember;

export default Ember.Route.extend(Authorized, PaginatedFilter, History, {
  queryParams: {
    page: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    }
  },

  titleToken: 'Dashboard',

  contentModel: inject.service(),

  model: function(params) {
    const contentModel = get(this, 'contentModel');
    const queryParams = [
      `page=${params.page}`,
      `per_page=${params.per_page}`,
      `sort=${params.sort}`
    ];

    const url = `${config.API_NAMESPACE}/dashboard?${queryParams.join('&')}`;

    return new RSVP.Promise((resolve) => {
      ajax(url).then((response) => {
        const contents = response.contents.map((record) => {
          return contentModel.convert(record);
        });

        resolve(contents);
      });
    });
  },

  setupController: function(controller, model) {
    controller.setProperties({
      model: model,
      currentUser: get(this, 'session.currentUser')
    });
  }
});
