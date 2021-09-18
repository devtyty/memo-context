import React, { useEffect } from "react";
import { initSaleRecord, saleRecordReducer } from "./reducer";
import SaleRecordSaga from "./sagas";
import Types from "./type";

const MyContextContext = React.createContext<
  Types.PropsContextState | undefined
>(undefined);

const MyContextProvider = React.memo((props: Types.PropsProvider) => {
  const [state, dispatch] = React.useReducer(saleRecordReducer, {
    ...initSaleRecord,
  });

  ///State
  const value: Types.PropsContextState = {
    state,
    sagaController: new SaleRecordSaga(dispatch),
    dispatchReducer: dispatch,
  };
  return (
    <MyContextContext.Provider value={value}>
      {props.children}
    </MyContextContext.Provider>
  );
});

function useMyContext() {
  const context = React.useContext(MyContextContext);
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
  * <MyContextConsumer
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
            >{`label`}</button>
          </div>
        );
      }}
    </MyContextConsumer>
 * ```
*/
const MyContextConsumer = React.memo(
  ({ children, shouldBuild }: Types.PropsConsumer) => {
    const context = useMyContext();

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

export { MyContextProvider, useMyContext, MyContextConsumer };
