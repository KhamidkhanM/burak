// generic "any object with any keys" type, used for controller objects (e.g. memberController: T = {})
export interface T {
  [key: string]: any; // any property name maps to any value type
}

export default T; // exported so controllers can type their handler-holding objects
