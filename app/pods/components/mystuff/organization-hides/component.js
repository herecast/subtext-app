import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Mystuff-OrganizationHides'],

  organizationHidesService: service('organization-hides'),
  organizationHides: readOnly('organizationHidesService.organizationHides')
});
