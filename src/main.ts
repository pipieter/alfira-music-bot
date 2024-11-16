import "dotenv/config";

import { Services } from "./services/services";

async function main() {
  Services.setup();

  await Services.client.run();
}

main();
