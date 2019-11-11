import { computed, set, get } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { Promise } from 'rsvp';
import { isBlank, isPresent } from '@ember/utils';

export default Service.extend(Evented, {
  session: service(),
  store: service(),
  fastboot: service(),

  thirdLikeComponent: null,
  hasLoadedLikes: false,
  likeCount: 0,

  likes: computed(function() {
    return get(this, 'store').peekAll('like');
  }),

  currentUser: computed(function() {
    return Promise.resolve( get(this, 'session.currentUser') );
  }),

  init() {
    this._super(...arguments);
    get(this, 'session').on('authenticationSucceeded', this, '_getLikes');
    this._getLikes();
  },

  _getLikes() {
    if (get(this, 'session.isAuthenticated') && !get(this, 'fastboot.isFastBoot')) {
      set(this, 'likeCount', 0);

      get(this, 'currentUser').then(currentUser => {
        get(this, 'store').query('caster', {
          user_id: get(currentUser, 'userId'),
          include: 'likes'
        })
        .then(() => {
          set(this, 'hasLoadedLikes', true);
          this.trigger('likesLoaded');
        });
      });
    }
  },

  _increaseLikeCount() {
    const likeCount = get(this, 'likeCount');
    set(this, 'likeCount', likeCount + 1);
  },

  register(likeComponent, method) {
    if (isBlank(get(this, 'thirdLikeComponent')) && parseInt(get(this, 'likeCount')) === 2) {
      set(this, 'thirdLikeComponent', likeComponent);
    }

    this._increaseLikeCount();

    if (!get(this, 'hasLoadedLikes')) {
      this.one('likesLoaded', likeComponent, method);
    } else {
      likeComponent[method]();
    }

    this.on('likesUpdated', likeComponent, method);
  },

  unregister(likeComponent, method) {
    const isThirdLikeComponent = get(likeComponent, 'contentId') === get(this, 'thirdLikeComponent.contentId');

    if (isThirdLikeComponent) {
      set(this, 'thirdLikeComponent', null);
    }
    this.off('likesLoaded', likeComponent, method);

    this.off('likesUpdated', likeComponent, method);
  },

  checkLike(contentId) {
    return new Promise((resolve) => {
      const likes = get(this, 'likes') || [];

      if (isPresent(likes)) {
        const matchingLike = likes.find(like => {
          return parseInt(get(like,'contentId')) === parseInt(contentId);
          //For initial phase of prototype we are only checking contentId
          //At some later point we will allow multiple likes per contentId with different eventInstanceIds
          //API blocks multiple likes with same contentId: until event-instance consolidation
        });
        resolve(matchingLike);
      }
      resolve(null);
    });

  },

  makeNewLike(contentId, eventInstanceId=null) {
    return get(this, 'currentUser').then(currentUser => {
      const newLike =  get(this, 'store').createRecord('like', {
        contentId: contentId,
        eventInstanceId: eventInstanceId,
        casterId: get(currentUser, 'userId')
      });

      return newLike.save()
      .then((like) => {
        this.trigger('likesUpdated');
        return like;
      });
    });
  },

  removeLike(like) {
    this.trigger('likeRemoved', {
      contentId: get(like, 'contentId'),
      eventInstanceId: get(like, 'eventInstanceId')
    });

    return like.destroyRecord()
    .then(() => {
      this.trigger('likesUpdated');
      return null;
    });
  }
});
