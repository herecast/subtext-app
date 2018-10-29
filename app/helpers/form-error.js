import { helper as buildHelper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import { isPresent } from '@ember/utils';

export function formError(params/*, hash*/) {
  const error = params[0];

  if (isPresent(error)) {
    return htmlSafe(`<span class='ContentForm-error'>${error}</span>`);
  }
}

export default buildHelper(formError);
