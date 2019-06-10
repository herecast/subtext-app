import AsyncButton from 'ember-async-button/components/async-button';
import TestSelector from 'subtext-app/mixins/components/test-selector';

export default AsyncButton.extend(TestSelector, {
  attributeBindings: ['data-test-component', 'data-test-action']
});
