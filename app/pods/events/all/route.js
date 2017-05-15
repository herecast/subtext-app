import Ember from 'ember';
import History from '../../../mixins/routes/history';
import RouteNameAdContext from 'subtext-ui/mixins/routes/route-name-ad-context';

const {set, get, isEmpty} = Ember;

export default Ember.Route.extend(History, RouteNameAdContext, {
  queryParams: {
    query: {
      refreshModel: true
    },
    category: {
      refreshModel: true
    },
    location: {
      refreshModel: true
    },
    organization: {
      refreshModel: true
    },
    date_start: {
      refreshModel: true
    },
    days_ahead: {
      refreshModel: true
    }
  },

  fillAWeek: false,

  model(params) {
    return this.store.query('event-instance', {
      category: params.category,
      query: params.query,
      date_start: params.date_start,
      days_ahead: params.days_ahead,
      location: params.location
    });
  },

  afterModel(model, transition) {
    const isFirstVisitedPageThisSession = transition.sequence === 0;
    const hasCategoryInQuery = !isEmpty(transition.queryParams.category);
    const doesNotHaveDaysAhead = isEmpty(transition.queryParams.days_ahead);

    if (isFirstVisitedPageThisSession && hasCategoryInQuery && doesNotHaveDaysAhead) {
      set(this, 'fillAWeek', true);
    }
  },

  setupController(controller) {
    this._super(...arguments);

    if (get(this, 'fillAWeek')) {
      Ember.run.next(()=>{
        controller.setDaysAhead(7);
        set(this, 'fillAWeek', false);
      });
    }
  }
});
