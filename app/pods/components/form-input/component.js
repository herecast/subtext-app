import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default Ember.TextField.extend(TestSelector, {
  classNames: ['FormInput']
});
