export function initialize(appInstance) {
  const logger = appInstance.lookup('service:logger');

  // Log 'error' level events to the console in fastboot
  logger.on('logMessages', (severity, messages) => {
    if (severity === 'error') {
      console.error(...messages);
    }
  });
}

export default {
  name: 'logger:console-browser',
  initialize
};
