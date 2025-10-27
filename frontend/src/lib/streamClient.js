import { StreamChat } from "stream-chat";

let client = null;

export function getClient(apiKey) {
  if (!client) client = StreamChat.getInstance(apiKey);
  return client;
}

/**
 * Connects the client to a user. If the client is already connected to the same user, it's a no-op.
 * If connected to a different user, it will disconnect and reconnect.
 */
export async function connectUserOnce(apiKey, user, token) {
  const c = getClient(apiKey);

  // If already connected to the same user, do nothing
  if (c.userID && c.userID === user.id) return c;

  // If connected to a different user, disconnect first
  if (c.userID && c.userID !== user.id) {
    try {
      await c.disconnectUser();
    } catch (e) {
      // swallow
      // eslint-disable-next-line no-console
      console.warn("Error disconnecting previous Stream user:", e);
    }
  }

  // Connect user with provided token
  await c.connectUser(user, token);
  return c;
}

export async function disconnectClient() {
  if (!client) return;
  try {
    await client.disconnectUser();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Error disconnecting Stream client:", e);
  }
  client = null;
}
