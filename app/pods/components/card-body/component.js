import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['CardBody'],

  classNameBindings: [
    'noBottomPadding:CardBody--noBottomPadding',
    'noSidePadding:CardBody--noSidePadding',
    'shortPadding:CardBody--shortPadding',
    'slimPadding:CardBody--slimPadding',
    'center:CardBody--center'
  ],

  noBottomPadding: false,
  noSidePadding: false,
  shortPadding: false,
  slimPadding: false,
  center: false
});
