import TextField from '@ember/component/text-field';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

export default TextField.extend(TestSelector, {
  classNames: ['FormInput']
});
