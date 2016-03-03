import Ember from 'ember';

export default Ember.Controller.extend({
  fromSearch: window.location.href.indexOf('?') >= 0
});
