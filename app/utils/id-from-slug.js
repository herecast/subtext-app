import Ember from 'ember';
const {isPresent} = Ember;

export default function idFromSlug(slug) {
  const numerics = slug.match(/\d+/);
  return (isPresent(numerics)) ? numerics[0] : null;
}
