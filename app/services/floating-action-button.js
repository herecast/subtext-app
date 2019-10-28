import { later } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import Evented from '@ember/object/evented';
import Service, { inject as service } from '@ember/service';
import { set, get, setProperties } from '@ember/object';

export default Service.extend(Evented, {
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
  justCreated: false,
  justEdited: false,

  resetParams() {
    setProperties(this, {
      showJobsTray: true,
      showUGC: false,
      editingModel: null,
      activeForm: 'market'
    })
  },

  expand(trackEvent = true) {
    if (trackEvent){
      get(this, 'tracking').trackUGCJobsTrayOpened();
    }
    get(this, 'modals').addModalBodyClass();
    set(this, 'showContent', true);
  },

  collapse(trackEvent = true) {
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

  setBehindModals(behind = false) {
    set(this, 'behindModals', behind);
  },

  launchContent(model, options = {}) {
    set(this, 'launchingModel', model);

    const { justCreated, justEdited } = options;

    if (justCreated) {
      set(this, 'justCreated', justCreated);
    } else if (justEdited) {
      set(this, 'justEdited', justEdited);
    }
  },

  didLaunchContent() {
    set(this, 'launchingModel', null);
  },

  promotionMenuClosed() {
    setProperties(this, {
      justCreated: false,
      justEdited: false
    });
  },

  editContent(passedModel) {
    const contentId = get(passedModel, 'contentId');
    const model = get(this, 'store').peekRecord('content', contentId);

    if (isPresent(model)) {
      return this._setupEditTransition(model);
    } else {
      return get(this, 'store').findRecord('content', contentId)
      .then((model) => {
        return this._setupEditTransition(model);
      });
    }
  },

  _setupEditTransition(model) {
    return new Promise((resolve) => {
      const router = get(this, 'router');
      const contentIsNews = get(model, 'contentType') === 'news';

      let transition;
      const currentRouteName = get(router, 'currentRouteName');

      if (contentIsNews) {
        transition = router.transitionTo('news.edit', get(model, 'id'));

        transition.promise.finally(() => {
          return resolve();
        });

        if (currentRouteName.includes('caster') || currentRouteName.includes('myfeed')) {
          this.trigger('closeShowModals', null);
        }

        return transition.retry();
      } else {
        const activeForm = get(model, 'contentType') === 'market' ? 'market' : 'event';

        setProperties(this, {
          editingModel: model,
          showJobsTray: false,
          showUGC: true,
          activeForm: activeForm,
        });


        if (currentRouteName.includes('.show')) {
          const routeNameArray = currentRouteName.split('.show');
          const newRouteName = routeNameArray[0];
          transition = router.transitionTo(newRouteName);
        } else if (currentRouteName.includes('caster')) {
          transition = router.transitionTo('caster.index');
          this.trigger('closeShowModals', 'caster.index');
        } else {
          transition = false;
        }

        if (transition) {
          transition.promise.finally(() => {
            this.expand(false);
            return resolve();
          });
          return transition.retry();
        } else {
          this.expand(false);
          return resolve();
        }
      }
    });
  }


});
