/**
 * Initializes the mock service worker for both client and server environments.
 * This function should be called at the entry point of the application to ensure
 * that the mocks are set up before any API calls are made.
 */
export async function initMocks() {
  if (typeof window === "undefined") {
    // Server-side environment
    const { server } = await import("./server");
    server.listen();
  } else {
    // Client-side environment
    const { worker } = await import("./browser");
    await worker.start();
  }
}
