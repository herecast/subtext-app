import Ember from 'ember';
import ConfirmMixin from 'subtext-ui/mixins/routes/confirm-transition-without-saving';

export default Ember.Route.extend(ConfirmMixin, {

  model() {
    return this.modelFor('account');
  },

  // Used by ConfirmMixin
  keyForModel: 'controller.model.currentUser'
});
