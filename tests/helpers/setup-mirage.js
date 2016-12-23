import mirageInitializer from '../../initializers/ember-cli-mirage';

export default function startMirage(container) {
  return mirageInitializer.initialize(container);
}
