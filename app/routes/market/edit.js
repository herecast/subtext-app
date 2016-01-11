import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';
import Editable from 'subtext-ui/mixins/routes/editable';

const { get } = Ember;

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, Editable, {
  model(params) {
    return this.store.findRecord('market-post', params.id, {reload: true});
  },

  setupController(controller, model) {
    this._super(controller, model);

    if (model.get('hasContactInfo')) {
      model.loadContactInfo();
    }
  },

  // Ember data doesn't automatically rollback relationship records, so we
  // need to do that manually if the market post is rolled back.
  discardRecord(model) {
    const recordDiscarded = this._super(...arguments);

    if (recordDiscarded) {
      get(model, 'images').forEach(image => image.rollbackAttributes());
    }

    return recordDiscarded;
  },

  // We can't depend on model.hasDirtyAttributes because it is always true,
  // most likely because we're mutating some values when the form loads.
  // We can check changedAttributes() instead, but need to account for
  // setting the contact info when the model loads. This will give us some
  // false positives, meaning it will tell the user there are changes when
  // there are not, but that seems better than false negatives.
  hasDirtyAttributes(model) {
    let modelIsDirty;

    if (get(model, 'hasContactInfo')) {
      modelIsDirty = Object.keys(model.changedAttributes()).length > 1;
    } else {
      modelIsDirty = get(model, 'hasDirtyAttributes');
    }

    // Ember data doesn't detect dirty attributes on relationship records,
    // so we need to do that manually.
    const imageHasDirtyAttrs = get(model, 'images').any((image) => {
      return get(image, 'hasDirtyAttributes');
    });

    return modelIsDirty || imageHasDirtyAttrs;
  },

  redirect() {
    this.transitionTo('market.edit.details');
  },

  actions: {
    afterDetails() {
      this.transitionTo('market.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('market.edit.preview');
    },

    afterPublish(post) {
      this.transitionTo('market.show', post.id).then(this.prerenderRecache.bind(this));
    },

    backToDetails() {
      this.transitionTo('market.edit.details');
    }
  }
});
