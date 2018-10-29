import { debounce, next } from '@ember/runloop';
import { defer } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { get, setProperties } from '@ember/object';
import { isPresent, isEmpty } from '@ember/utils';

/* Class AdContext
 *
 * This is a data container to hold the previously fetched ad ids (loadedIds)
 * within a particular context (usually a routeName), and the promises waiting
 * for an ad. Once it receives data from the api, it will resolve the promises
 * each with a returned ad.
 */
function AdContext() {
  this.loadedIds = [];
  this.queue = [];
  this.promises = [];
  this.contentId = null;
  this.promotionId = null;
  this.isProcessing = false;

  // Lock this context, and copy the queue to the promises property so the
  // queue can continue to be added to for the next cycle.
  this.startProcessing = function() {
    this.promises = this.queue;
    this.queue = [];
    this.isProcessing = true;
  };

  // Record that an ad was loaded in this context.
  this.adLoaded = function(id) {
    this.loadedIds.push(id);
  };

  // Given a list of promotions from the api,
  // resolve each of the waiting promises, each with a promotion record.
  this.resolveAll = function(promotions) {
    promotions.forEach((promo, i) => {
      this.adLoaded(promo.id);
      let p = this.promises[i];
      if (isPresent(p)) {
        p.resolve(promo);
      }
    });
  };

  this.rejectAll = function(data) {
    this.promises.forEach((p) => {
      p.reject(data);
    });
  };

  // Unlock, so the queue can be processed again.
  // House cleaning.
  this.finishProcessing = function() {
    this.isProcessing = false;
    this.promises = [];
  };
}

export default Service.extend({
  api: service(),

  init() {
    this._super(...arguments);
    setProperties(this, {
      _contexts: {}
    });
  },

  clearContext(contextName) {
    delete get(this, '_contexts')[contextName];
  },

  createContext(contextName) {
    const ctx = new AdContext();
    get(this, '_contexts')[contextName] = ctx;
    return ctx;
  },

  getAd(contextName, opts = {}) {
    const ctx = this._getContext(contextName);

    if(!ctx.contentId) {
      ctx.contentId = opts['contentId'];
    }

    if(!ctx.clientId) {
      ctx.clientId = opts['clientId'];
    }

    if(!ctx.locationId) {
      ctx.locationId = opts['locationId'];
    }

    ctx.promotionId = opts['promotionId'];

    const deferfn = defer();
    ctx.queue.push(deferfn);
    debounce(contextName, () => {
      if(!this.isDestroying) {
        this._processQueue(contextName);
      }
    }, 150);

    return deferfn.promise;
  },

  _getContext(contextName) {
    let ctx = get(this, '_contexts')[contextName];

    if(isEmpty(ctx)) {
      // Create temporary context
      //
      // if a context wasn't pre-created at this point, then make a
      // temporary one.
      ctx = this.createContext(contextName);
      ctx.isTemporary = true;
    }

    return ctx;
  },


  _processQueue(contextName) {
    const ctx = this._getContext(contextName);
    if(ctx.queue.length) {

      if(ctx.isProcessing) {
        // Do not process now, there is another thread processing,
        // wait until the next run loop to try again.
        next(this, ()=> {
          if(!this.isDestroying) {
            this._processQueue(contextName);
          }
        });
        return;
      }

      const api = get(this, 'api');
      const loadedIds = ctx.loadedIds;

      ctx.startProcessing();

      api.getContentPromotions({
        content_id: ctx.contentId,
        client_id: ctx.clientId,
        location_id: ctx.locationId,
        promotion_id: ctx.promotionId,
        exclude: loadedIds,
        limit: ctx.promises.length

      }).then((response) => {
        if(!this.isDestroying) {
          ctx.resolveAll(response.promotions || []);
        }
        return response;

      }, (response) => {

        ctx.rejectAll(response);
        return response;

      }).finally(() => {

        ctx.finishProcessing();

        if(ctx.isTemporary && !ctx.queue.length) {
          // if a context wasn't pre-created, it is marked a temporary.
          // Remove it because it's no longer needed.
          this.clearContext(contextName);
        }

      });
    }
  }
});
