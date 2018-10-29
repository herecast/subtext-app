import { isPresent } from '@ember/utils';

export default function idFromSlug(slug) {
  const numerics = slug.match(/\d+/);
  return (isPresent(numerics)) ? numerics[0] : null;
}
