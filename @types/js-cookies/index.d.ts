declare module 'js-cookie' {
    interface Cookies {
      get(name: string): string | undefined;
      set(name: string, value: string, options?: any): void;
      remove(name: string, options?: any): void;
      withAttributes(attributes: object): Cookies;
    }
  
    const cookies: Cookies;
    export = cookies;
  }