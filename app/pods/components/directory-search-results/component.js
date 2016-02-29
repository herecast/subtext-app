import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  classNames: ['DirectoryListings'],
  results: null,

  init(){
    this._super();
  }
});
