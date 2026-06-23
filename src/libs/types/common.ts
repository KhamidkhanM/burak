// generic "any object with any keys" type, used for controller objects (e.g. memberController: T = {})
export interface T {
  [key: string]: any;
}

export default T;