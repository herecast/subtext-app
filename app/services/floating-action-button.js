import { later, next } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { set, get, setProperties } from '@ember/object';
import { Promise } from 'rsvp';
import Evented from '@ember/object/evented';
import Service, { inject as service } from '@ember/service';

export default Service.extend(Evented, {
  tracking: service(),
  modals: service(),
  notify: service('notification-messages'),
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

    this._launchRedirect(model, options);
  },

  _currentPath() {
    return get(this, 'router.currentRouteName');
  },

  _currentParentPath() {
    const currentRouteName = this._currentPath();
    const currentRouteArray = currentRouteName.split('.');
    return currentRouteArray[0];
  },

  _launchRedirect(model, options = {}) {
    const showPathParent = options.showPathParent || this._currentParentPath();
    const queryParams = options.queryParams || {};
    const router = get(this, 'router');

    next(() => {
      const contentId = get(model, 'id');
      const eventInstanceId = get(model, 'eventInstanceId') || false;
      let transitionOptions;

      if (eventInstanceId) {
        transitionOptions = [`${showPathParent}.show-instance`, contentId, eventInstanceId, {queryParams}];
      } else {
        transitionOptions = [`${showPathParent}.show`, contentId, {queryParams}];
      }

      router.transitionTo(...transitionOptions);
    });
  },

  deleteContent(model) {
    set(model, 'deleted', true);

    const contentId = get(model, 'id');
    const content = get(this, 'store').peekRecord('content', contentId);

    this.trigger('closeShowModals', null);

    if (content) {
      next(() => {
        set(model, 'isHiddenFromFeed', true);
        content.destroyRecord()
        .then(() => {
          this._hideParentFeedItem(contentId);
        })
        .catch(() => {
          get(this, 'notify').error('There was a problem deleting your post. Please reload the page and try again.');
        });
      });
    }
  },

  _hideParentFeedItem(contentId) {
    const parentFeedItem = get(this, 'store').peekRecord('feed-item', contentId);

    later(() => {
      if (!get(parentFeedItem, 'isDestroyed')) {
        set(parentFeedItem, 'isHiddenFromFeed', true);
      }
    }, 1200);
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
