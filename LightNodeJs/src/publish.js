const StreamrClient = require("streamr-client");
const utils = require("./utils.js");
const { PrivateKey } = require("./config.js");
const main = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      utils.isValidPrivateKey(PrivateKey);
      // Create the client using the validated private key
      const clientConfig = utils.getClientConfig(process.argv);
      const client = new StreamrClient({
        ...clientConfig,
        auth: {
          privateKey: PrivateKey,
        },
      });

      // Create the default stream
      const stream = await client.getOrCreateStream({
        id: `/light-node-js-example`,
      });

      const interval = setInterval(async () => {
        const message = {
          type: "client:publish",
          ts: Date.now(),
        };
        await client.publish(stream, message);
        console.log("Sent successfully: ", message);
        resolve({ client, interval });
      }, 1000);
    } catch (e) {
      reject(e);
    }
  });
};

if (utils.isRunFlagPresent(process.argv)) {
  main();
}

module.exports = main;
