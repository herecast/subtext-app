import Ember from 'ember';

const {get, isPresent, computed} = Ember;

export default Ember.Component.extend({
  classNames: ['OrganizationContactCard'],
  organization: null,

  flattenCard: false,

  hideLabels: computed('organization.{phone,email,address,website,twitter}', function() {
    return ['phone', 'email', 'address', 'website', 'twitterHandle']
        .map((k) => { return get(this, `organization.${k}`); })
        .filter(isPresent)
        .length > 3;
  })
});
