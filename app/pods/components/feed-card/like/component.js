import { readOnly, notEmpty, alias, gt, not } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
export default Component.extend({
  classNames: 'FeedCard-Like',
  classNameBindings: ['isLiked:liked'],
  'data-test-like': computed('isLiked', function() {
    return get(this, 'isLiked') ? 'liked' : 'not-liked';
  }),
  'data-test-like-content': readOnly('contentId'),
  'data-test-like-like-count': readOnly('likeCount'),

  store: service(),
  session: service(),
  modals: service(),
  tracking: service(),
  currentService: service('current-controller'),
  likeService: service('likes'),
  currentPath: readOnly('currentService.currentPath'),

  model: null,
  like: null,
  justLiked: false,
  notActive: false,
  isActive: not('notActive'),

  contentId: readOnly('model.contentId'),
  eventInstanceId: readOnly('model.eventInstanceId'),
  likeCount: alias('model.likeCount'),

  isLoggedIn: readOnly('session.isAuthenticated'),
  isLiked: notEmpty('like'),

  showLikeCount: gt('likeCount', 0),
  likeCountMessage: computed('likeCount', function() {
    if (get(this, 'likeCount') === 1) {
      return 'Like';
    }

    return 'Likes';
  }),


  init() {
    this._super(...arguments);
    get(this, 'likeService').register(this, '_updateLike');
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, 'likeService').unregister(this, '_updateLike');

  },

  _updateLike() {
    const contentId = get(this, 'contentId');
    const eventInstanceId = get(this, 'eventInstanceId') || null;

    get(this, 'likeService').checkLike(contentId, eventInstanceId)
    .then((like) => {
      if (!get(this, 'isDestroying')) {
        set(this, 'like', like || null);
      }
    });
  },

  _openSignInModal() {
    get(this, 'modals').showModal('modals/sign-in-register', {
      model: 'sign-in',
      alternateSignInMessage: 'You must be signed in to like and save posts'
    });
  },

  _changeLikeCount(increment = 1) {
    const likeCount = get(this, 'model.likeCount');
    set(this, 'model.likeCount', likeCount + increment);
  },

  _setLike() {
    let like = get(this, 'like');

    if (isBlank(like)) {
      this._trackEvent('CreateLike');
      this._changeLikeCount();

      get(this, 'likeService').makeNewLike(get(this, 'contentId'), get(this, 'eventInstanceId'))
      .then((like) => {
        set(this, 'like', like);
        set(this, 'justLiked', true);
      });
    } else {
      this._trackEvent('RemoveLike');
      this._changeLikeCount(-1);

      get(this, 'likeService').removeLike(get(this, 'like'))
      .then(() => {
        if (!get(this, 'isDestroying')) {
          set(this, 'like', null);
          set(this, 'justLiked', false);
        }
      });
    }
  },

  _trackEvent(eventName) {
    get(this, 'tracking').trackLikeEvent(eventName, get(this, 'contentId'), get(this, 'currentPath'));
  },

  actions: {
    clickLike() {
      if (!get(this, 'isLoggedIn')) {
        this._trackEvent('UnregisteredClick');
        this._openSignInModal();
      } else if (get(this, 'isActive')) {
        this._setLike();
      }
    }
  }
});
