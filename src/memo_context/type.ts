import { SalesRecordState } from "./reducer";

export declare module Types {

  /**
   * Provider type
   */
  export interface PropsProvider {
    children: React.ReactNode;
  }


  /**Props holding memo selector component */
  export interface PropsSelector {
    children: (context: PropsContextState) => React.ReactNode;
    context: PropsContextState;
  }


  /**
   * Reducer type
   */
  export interface PropsContextState {
    state: SalesRecordState;
    dispatch: Dispatch;
  }

  export interface PropsConsumer {
    children: (context: PropsContextState) => React.ReactNode;
    shouldBuild?: (currentState: SalesRecordState, nextState: SalesRecordState) => boolean;
  }

  /**
   * Dispatcher and Actions reducer
   */

   export type Dispatch = (action: ActionReducer) => void;
    export type ActionReducer = { type: 'increment' } | { type: 'decrement' } | { type: 'render' } | { type: 'update-label'; label: string; };
  


  /**
   * State management
   */
}