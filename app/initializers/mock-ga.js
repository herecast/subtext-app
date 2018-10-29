import config from 'subtext-ui/config/environment';

export function initialize() {
  if (typeof FastBoot === 'undefined') {
    if (config.mockWindowGa) {
      window.ga = {
        getAll() {
          return [
            {
              get(key) {
                if (key === 'clientId') {
                  return 'developer';
                }
              }
            }
          ];
        }
      };
    }
  }
}

export default {
  name: 'browser/mock-ga',
  initialize
};
