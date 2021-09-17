import { SalesRecordState } from "./reducer";

export declare module Types {
  /**
   * Types
   */

  export interface PropsProvider {
    children: React.ReactNode;
  }

  export interface PropsSelector {
    children: (context: PropsContextState) => React.ReactNode;
    context: PropsContextState;
  }




  export interface PropsContextState {
    state: SalesRecordState;
    dispatch: Dispatch;
  }

  export interface PropsConsumer {
    children: (context: PropsContextState) => React.ReactNode;
    shouldBuild?: (currentState: SalesRecordState, nextState: SalesRecordState) => boolean;
  }

  /**
   * Dispatcher and Actions
   */

   export type Dispatch = (action: ActionReducer) => void;
   export type ActionReducer = { type: 'increment' } | { type: 'decrement' } | { type: 'render' } | { type: 'update-label'; label: string; };


  /**
   * State management
   */
}