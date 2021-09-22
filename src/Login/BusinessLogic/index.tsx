import React, { useEffect } from "react";
import { LoginState, LoginReducer, initLoginState, Dispatch } from "./reducer";
import LoginSaga from "./sagas";

const LoginContext = React.createContext<
  PrivateType.PropsContextState | undefined
>(undefined);

/**Provider: Entry point */
const LoginProvider = React.memo((props: PrivateType.PropsProvider) => {
  const [state, dispatch] = React.useReducer(LoginReducer, {
    ...initLoginState,
  });

  ///State
  const value: PrivateType.PropsContextState = {
    state,
    sagaController: new LoginSaga(dispatch),
    dispatchReducer: dispatch,
  };

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  );
});

/**Use context */
function useLogin() {
  const context = React.useContext(LoginContext);

  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

///Effective memo
const MySelectorComponent = React.memo((props: PrivateType.PropsSelector) => {
  return <>{props.children(props.context)}</>;
});

/** Holding state: Just render UI when origin state changed and shouldBuild is true | undefined.*/
const LoginConsumer = React.memo(
  ({ children, shouldBuild }: PrivateType.PropsConsumer) => {
    const context = useLogin();

    const [myState, setMyState] =
      React.useState<PrivateType.PropsContextState>(context);

    useEffect(() => {
      if (shouldBuild && shouldBuild(myState.state, context.state)) {
        setMyState(context);
      }
    }, [context]);

    return (
      <MySelectorComponent context={myState}>{children}</MySelectorComponent>
    );
  }
);

export { LoginProvider, useLogin, LoginConsumer };
  
export declare module Types {
  type State = LoginState;
  type DispatchReducer = Dispatch;
  type Sagas = LoginSaga;
}

declare module PrivateType {
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

  interface PropsContextState {
    state: LoginState;
    dispatchReducer: Dispatch;
    sagaController: LoginSaga;
  }

  interface PropsConsumer {
    children: (context: PropsContextState) => React.ReactNode;
    shouldBuild?: (currentState: LoginState, nextState: LoginState) => boolean;
  }
}
