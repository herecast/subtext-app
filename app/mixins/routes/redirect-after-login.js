import Mixin from '@ember/object/mixin';

export default Mixin.create({
  // Redirect user back to this page after logging in
  beforeModel: function(transition) {
    if (!this.get('session.isAuthenticated')) {
      this.set('session.attemptedTransition', transition);
    }
    this._super(...arguments);
  }
});
