import Ember from 'ember';

export function dynamicParams([routeName, params]/*, hash*/) {
  return [
    routeName,
    {
      isQueryParams: true,
      values: params
    }
  ];
}

export default Ember.Helper.helper(dynamicParams);
