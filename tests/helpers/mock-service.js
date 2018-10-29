import Service from '@ember/service';
import { getContext } from '@ember/test-helpers';

let stubService = (name, hash = {}) => {
  let stubbedService = Service.extend(hash);

  let { owner } = getContext();
  return owner.register(`service:${name}`, stubbedService);
};

export default stubService;
