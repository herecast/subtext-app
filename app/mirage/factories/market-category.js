import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name() { return faker.company.bsNoun(); },
  query() { return faker.company.bsNoun(); },
  img() { return `http://placehold.it/400x300/${
    (function co(lor){ return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length === 6) ? lor : co(lor); })('')}/ffffff`; },
  banner() { return `http://placehold.it/1600x900/${
    (function co(lor){ return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length === 6) ? lor : co(lor); })('')}/ffffff`; },
  featured() { return false; },
  trending() { return false; },
  count() { return Math.floor(Math.random()*100); }
});
