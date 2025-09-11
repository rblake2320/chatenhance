// Global type definitions for chatenhance

declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createMockUser: () => {
          id: string;
          email: string;
          name: string;
        };
        createMockRequest: (overrides?: any) => {
          body: any;
          params: any;
          query: any;
          headers: any;
        };
        createMockResponse: () => {
          status: jest.Mock;
          json: jest.Mock;
          send: jest.Mock;
          cookie: jest.Mock;
          clearCookie: jest.Mock;
        };
      };
    }
  }

  var testUtils: {
    createMockUser: () => {
      id: string;
      email: string;
      name: string;
    };
    createMockRequest: (overrides?: any) => {
      body: any;
      params: any;
      query: any;
      headers: any;
    };
    createMockResponse: () => {
      status: jest.Mock;
      json: jest.Mock;
      send: jest.Mock;
      cookie: jest.Mock;
      clearCookie: jest.Mock;
    };
  };
}

export {};
