type QueueClient = (data: any) => void;

const clients = new Set<QueueClient>();

export const addQueueClient = (client: QueueClient) => {
  clients.add(client);
};

export const removeQueueClient = (client: QueueClient) => {
  clients.delete(client);
};

export const broadcastQueueUpdate = (data: any = {}) => {
  clients.forEach((client) => {
    try {
      client(data);
    } catch (err) {
      console.error(err);
    }
  });
};
