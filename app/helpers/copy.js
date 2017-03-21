import Ember from 'ember';

const {
  isArray
} = Ember;

export function copy(params, hash) {
  if(isArray(params[0])) {
    const toArry = params[0].toArray();
    const eArry = Ember.A(toArry);

    return Ember.copy(eArry, !!hash['deep']);
  } else {
    return Ember.copy(params[0], !!hash['deep']);
  }
}

export default Ember.Helper.helper(copy);
