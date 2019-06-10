import TextField from '@ember/component/text-field';
import TestSelector from 'subtext-app/mixins/components/test-selector';

export default TextField.extend(TestSelector, {
  classNames: ['FormInput']
});
