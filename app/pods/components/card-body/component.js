import Component from '@ember/component';

export default Component.extend({
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
