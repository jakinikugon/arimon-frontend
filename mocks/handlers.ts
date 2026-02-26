import { HttpResponse, http } from "msw";

export const mswTestEndpoint = "https://msw.test.com";

export const handlers = [
  // MSW test endpoint
  http.get(mswTestEndpoint, () => {
    return HttpResponse.json({
      message: "Hello from MSW!",
    });
  }),

  // Mock API endpoint
];
