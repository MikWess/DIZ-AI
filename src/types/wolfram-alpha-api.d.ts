declare module 'wolfram-alpha-api' {
  interface WolframAlphaAPI {
    getShort: (query: string) => Promise<string>;
    getFull: (query: string) => Promise<any>;
  }

  function createClient(appId: string): WolframAlphaAPI;
  export default createClient;
} 