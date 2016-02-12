/**
 * Seeds for development
 */
export default function(server) {
  server.loadFixtures();
  server.createList('content-metric',1);
  server.createList('ad-metric',1);
}
