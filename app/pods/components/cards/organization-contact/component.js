import Ember from 'ember';

const {get, isPresent, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['OrganizationContactCard'],
  organization: null,

  flattenCard: false,
  showTopBorder: false,

  hideLabels: computed('organization.{phone,email,address,website}', function() {
    return ['phone', 'email', 'address', 'website']
        .map((k) => { return get(this, `organization.${k}`); })
        .filter(isPresent)
        .length > 3;
  })
});
