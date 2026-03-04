import { HttpResponse, http } from "msw";

export const mswTestEndpoint = "https://msw.test.com";

export const testHandlers = [
  http.get(mswTestEndpoint, () => {
    return HttpResponse.json({ message: "Hello from MSW!" });
  }),
];
