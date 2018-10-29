import { helper as buildHelper } from '@ember/component/helper';

export function showEventsAd(params) {
  const runningIndex = params[0];

  return (runningIndex > 0 && (runningIndex === 3 || (runningIndex - 3) % 8 === 0));
}

export default buildHelper(showEventsAd);
