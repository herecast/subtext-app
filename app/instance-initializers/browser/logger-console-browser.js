export function initialize(appInstance) {
  const logger = appInstance.lookup('service:logger');

  logger.on('logMessages', (severity, messages) => {
    if (typeof console !== 'undefined' && severity in console) {
      console[severity](...messages);
    }
  });
}

export default {
  name: 'logger:console-browser',
  initialize
};
