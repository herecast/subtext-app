import { later } from '@ember/runloop';
import Service, { inject as service } from '@ember/service';
import { set, get, setProperties } from '@ember/object';

export default Service.extend({
  tracking: service(),
  modals: service(),
  router: service(),
  store: service(),

  isAnimatingAway: false,
  showContent: false,
  behindModals: false,
  showJobsTray: true,
  showUGC: false,
  activeForm: 'market',
  editingModel: null,
  launchingModel: null,

  resetParams() {
    setProperties(this, {
      showJobsTray: true,
      showUGC: false,
      editingModel: null,
      activeForm: 'market'
    })
  },

  expand(trackEvent=true) {
    if (trackEvent){
      get(this, 'tracking').trackUGCJobsTrayOpened();
    }
    get(this, 'modals').addModalBodyClass();
    set(this, 'showContent', true);
  },

  collapse(trackEvent=true) {
    if (trackEvent) {
      get(this, 'tracking').trackUGCJobsTrayClosed();
    }
    get(this, 'modals').removeModalBodyClass();
    set(this, 'isAnimatingAway', true);

    later(() => {
      if (!get(this, 'isDestroyed')) {
        set(this, 'showContent', false);
        set(this, 'isAnimatingAway', false);
        this.resetParams();
      }
    }, 300);
  },

  setBehindModals(behind=false) {
    set(this, 'behindModals', behind);
  },

  launchContent(model) {
    set(this, 'launchingModel', model);
  },

  didLaunchContent() {
    set(this, 'launchingModel', null);
  },

  editContent(passedModel) {
    return new Promise((resolve) => {

      const model = get(this, 'store').peekRecord('content', get(passedModel, 'contentId'));

      const activeForm = get(model, 'contentType') === 'market' ? 'market' : 'event';

      setProperties(this, {
        editingModel: model,
        showJobsTray: false,
        showUGC: true,
        activeForm: activeForm,
      });

      const router = get(this, 'router');
      const contentIsNews = get(model, 'contentType') === 'news';

      let transition;

      if (contentIsNews) {
        transition = router.transitionTo('news.edit', get(model, 'id'));
      } else {

        const currentRouteName = get(router, 'currentRouteName');

        if (currentRouteName.includes('.show')) {
          const routeNameArray = currentRouteName.split('.show');
          const newRouteName = routeNameArray[0];
          transition = router.transitionTo(newRouteName);
          transition['data'] = {displayAsAdminIfAllowed: true};
        } else {
          transition = false;
        }

        if (transition) {
          return transition.promise.finally(() => {
            this.expand(false);
            return resolve();
          });
        } else {
          this.expand(false);
          return resolve();
        }
      }
    });
  }
});
