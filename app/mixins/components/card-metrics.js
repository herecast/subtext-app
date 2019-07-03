/* global IntersectionObserver */
import Mixin from '@ember/object/mixin';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { computed, trySet, set, get } from '@ember/object';
import { run } from '@ember/runloop';

export default Mixin.create({
  tracking: service(),
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
          const impressionLocation = get(this, 'impressionLocation');
          get(this, 'tracking').trackTileImpression({
            model: model,
            impressionLocation: impressionLocation
          });
          set(this, '_didEnterViewPort', true);

          this._unbindListeners();
        }
      }
    });
  },

  didInsertElement() {
    this._super(...arguments);

    const intersection = new IntersectionObserver(this._intersectionCallback.bind(this), {
      root: get(this, 'root'),
      threshold: get(this, 'threshold'),
      rootMargin: get(this, 'rootMargin')
    });
    intersection.observe(this.element);
    if(!get(this, 'isDestroying')) {
      set(this, '_intersectionObserver', intersection);
    }
  },

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
