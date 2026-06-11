import { addQueueClient, removeQueueClient } from "../../utils/queue-events";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");

  const send = (data: any) => {
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  addQueueClient(send);

  send({
    connected: true,
  });

  const heartbeat = setInterval(() => {
    send({
      heartbeat: true,
    });
  }, 30000);

  event.node.req.on("close", () => {
    clearInterval(heartbeat);
    removeQueueClient(send);
  });
});
