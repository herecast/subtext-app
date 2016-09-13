import Ember from 'ember';

export default Ember.Service.extend({
  redirectTo(href) {
    return window.location.href = href;
  },
  replace(href) {
    return window.location.replace(href);
  },
  reload() {
    return window.location.reload();
  },
  href() {
    return window.location.href;
  }
});
