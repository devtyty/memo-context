import React, { useEffect } from "react";
import { initLoginState, LoginReducer } from "./reducer";
import LoginSaga from "./sagas";
import Types from "./type";

const LoginContext = React.createContext<
  Types.PropsContextState | undefined
>(undefined);

const LoginProvider = React.memo((props: Types.PropsProvider) => {
  const [state, dispatch] = React.useReducer(LoginReducer, {
    ...initLoginState,
  });

  ///State
  const value: Types.PropsContextState = {
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

function useLogin() {
  const context = React.useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

///Effective memo
const MySelectorComponent = React.memo((props: Types.PropsSelector) => {
  return <>{props.children(props.context)}</>;
});

/** Holding state: Just render UI when origin state changed and shouldBuild is true | undefined.
 * 
 * Example: 
 * ```
  * <LoginConsumer
      shouldBuild={(curr, next) => curr.label !== next.label}
    >
      {({ state, dispatch }) => {
        console.log("render label");

        return (
          <div>
            <div>{state.label}</div>
            <button
              onClick={() =>
                dispatch({
                  type: "update-label",
                  label: `label: ${Date.now()}`,
                })
              }
              style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
              type="button"
              className="px-5 mt-3 btn btn-secondary"
            >{'label'}</button>
          </div>
        );
      }}
    </LoginConsumer>
 * ```
*/
const LoginConsumer = React.memo(
  ({ children, shouldBuild }: Types.PropsConsumer) => {
    const context = useLogin();

    const [myState, setMyState] =
      React.useState<Types.PropsContextState>(context);

    useEffect(() => {
      if (shouldBuild) {
        if (shouldBuild(myState.state, context.state)) setMyState(context);
      } else {
        setMyState(context);
      }
    }, [context]);

    return (
      <MySelectorComponent context={myState}>{children}</MySelectorComponent>
    );
  }
);

export { LoginProvider, useLogin, LoginConsumer };

