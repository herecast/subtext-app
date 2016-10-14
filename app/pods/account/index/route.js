import Ember from 'ember';
import ConfirmMixin from 'subtext-ui/mixins/routes/confirm-transition-without-saving';

const { get } = Ember;

export default Ember.Route.extend(ConfirmMixin, {

  model() {
    return this.modelFor('account');
  },

  // Used by ConfirmMixin
  keyForModel: 'controller.model.currentUser',

  // Used by ConfirmMixin
  hasDirtyAttributes() {
    const keyForModel = get(this, 'keyForModel');
    return get(this, `${keyForModel}.hasPendingChanges`);
  }
});
