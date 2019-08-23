import Service from '@ember/service';
import { getContext } from '@ember/test-helpers';

let stubService = (name, hash = {}) => {
  let stubbedService = Service.extend(hash);

  let { owner } = getContext();
  let existingService = owner.lookup(`service:${name}`) || false;

  if (existingService) {
    owner.unregister(`service:${name}`);
  }

  return owner.register(`service:${name}`, stubbedService);
};

export default stubService;
