import { startServer } from "../scripts/server.mjs";

export default async function globalSetup() {
  const server = await startServer({ port: 4174 });

  return async () => {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  };
}
