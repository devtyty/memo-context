import LoginSaga from "./sagas";

declare module Types {
  /**
   * Provider type
   */
  interface PropsProvider {
    children: React.ReactNode;
  }

  /**Props holding memo selector component */
  interface PropsSelector {
    children: (context: PropsContextState) => React.ReactNode;
    context: PropsContextState;
  }

  /**
   * Reducer type
   */
  
  interface PropsContextState {
    state: SalesRecordState;
    dispatchReducer: DispatchReducer;
    sagaController: LoginSaga;
  }

  interface PropsConsumer {
    children: (context: PropsContextState) => React.ReactNode;
    shouldBuild?: (
      currentState: SalesRecordState,
      nextState: SalesRecordState
    ) => boolean;
  }

  /**
   * Dispatcher and Actions reducer
   */

  type DispatchReducer = (action: ActionReducer) => void;
  type ActionReducer =
     | { type: "increment" }
     | { type: "decrement" }
     | { type: "render" }
     | { type: "update-label"; label: string };

  interface SalesRecordState {
     count: number;
     label: string;
   }
}

export default Types;

