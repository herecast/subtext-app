/* global IntersectionObserver */
import Ember from 'ember';

const {
  on,
  get,
  set,
  trySet,
  isPresent,
  inject: {service},
  computed,
  run
} = Ember;

export default Ember.Mixin.create({
  tracking: service(),
  features: service('feature-flags'),
  root: null, // Scope to scrollable area, or null is viewport
  rootMargin: "60px 0px 0px 0px", //(Viewport/document margin)
  threshold: 0.1,

  _didEnterViewPort: false,

  // Use to disable when being covered by another layer or modal.
  impressionsEnabled: true,

  willDestroyElement() {
    this._unbindListeners();
    this._super();
  },

  _canSendImpression: computed('impressionsEnabled', '_isIntersecting', function() {
    const enabled = get(this, 'impressionsEnabled'),
          isIntersecting = get(this, '_isIntersecting');

    return !!(isIntersecting && enabled);
  }),

  _trySendImpression() {
    run(()=>{
      const canSend = get(this, '_canSendImpression');
      const notAlreadySent = !get(this, '_didEnterViewPort');
      if(!get(this, 'isDestroying')) {
        if(notAlreadySent && canSend) {
          const model = get(this, 'model');
          get(this, 'tracking').trackTileImpression(model);
          set(this, '_didEnterViewPort', true);

          this._unbindListeners();
        }
      }
    });
  },

  _setupImpressionObserver: on('didInsertElement', function() {
    this._super();

    const intersection = new IntersectionObserver(this._intersectionCallback.bind(this), {
      root: get(this, 'root'),
      threshold: get(this, 'threshold'),
      rootMargin: get(this, 'rootMargin')
    });
    intersection.observe(this.element);
    if(!get(this, 'isDestroying')) {
      set(this, '_intersectionObserver', intersection);
    }
  }),

  _intersectionCallback(entries) {
    if(!get(this, 'isDestroying')) {
      entries.forEach((entry) => {
        if(entry.intersectionRatio > 0) {
          run(()=>{
            if(!get(this, 'isDestroying')) {
              set(this, '_isIntersecting', true);
            }
          });
          run.next(()=>{
            if(!get(this, 'isDestroying')) {
              run.throttle(this, this._trySendImpression, 200);
            }
          });
        } else {
          run(()=>{
            if(!get(this, 'isDestroying')) {
              set(this, '_isIntersecting', false);
            }
          });
        }
      });
    }
  },

  _unbindListeners() {
    const observer = get(this, '_intersectionObserver');
    if(isPresent(observer)) {
      observer.unobserve(this.element);
    }
    trySet(this, '_intersectionObserver', undefined);
  }
});
