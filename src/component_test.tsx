import React from "react";
import { MyContextConsumer, MyContextProvider } from "./memo_context";

interface Props {}

const ComponentTest: React.FC<Props> = (props: Props) => {
  return (
    <MyContextProvider>
      <TestConsumer />
    </MyContextProvider>
  );
};

const TestConsumer = () => {
  return (
    <div>
      <MyContextConsumer
        shouldBuild={(curr, next) => curr.count !== next.count}
      >
        {({ state, dispatchReducer, sagaController }) => {
          console.log('render count');
          return (
            <div>
              <div>{state.count}</div>
              <button
                onClick={() => sagaController.requestApi({payload: 'payload'})}
                style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
                type="button"
                className="px-5 mt-3 btn btn-secondary"
              >
                Tăng
              </button>
              <button
                onClick={() => dispatchReducer({ type: "decrement" })}
                style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
                type="button"
                className="px-5 mt-3 btn btn-secondary"
              >
                Giảm
              </button>
            </div>
          );
        }}
      </MyContextConsumer>

      <MyContextConsumer
        shouldBuild={(curr, next) => curr.label !== next.label}
      >
        {({ state, dispatchReducer }) => {
          console.log("render label");

          return (
            <div>
              <div>{state.label}</div>
              <button
                onClick={() =>
                  dispatchReducer({
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
    </div>
  );
};

export default ComponentTest;
