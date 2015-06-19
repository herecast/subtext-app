import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service('session'),

  beforeModel(transition) {
    const currentUser = this.get('session.currentUser');

    if (Ember.isBlank(currentUser)) {
      transition.abort();

      const pathname = this.router.location.location.pathname;
      const url = `/users/sign_in?after_sign_in_path=${pathname}`;

      window.location.replace(url);
    } else {
      this._super(transition);
    }
  }
});
