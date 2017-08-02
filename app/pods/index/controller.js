import Ember from 'ember';
import LocationMixin from 'subtext-ui/mixins/controllers/location';

export default Ember.Controller.extend(LocationMixin, {
  channel: 'index'
});
