import React from 'react';
import { MyContextConsumer, MyContextProvider, useMyContext } from './test_context';

interface Props {

}



const ComponentTest: React.FC<Props> = (props: Props) => {
  return (
    <MyContextProvider>
      <TestConsumer />
    </MyContextProvider>
  );
};


const TestConsumer = () => {
  return (
    <MyContextConsumer
      shouldBuild={(curr, next) => curr.count !== next.count}
      key={"my-consumer"}
    >
      {({ state, dispatch }) => {
        console.log("render consumer");

        return (
          <div>
            <div>{state.count}</div>
            <button
              onClick={() => dispatch({ type: "increment" })}
              style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
              type="button"
              className="px-5 mt-3 btn btn-secondary"
            >
              Tăng
            </button>
            <button
              onClick={() => dispatch({ type: "decrement" })}
              style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
              type="button"
              className="px-5 mt-3 btn btn-secondary"
            >
              Giảm
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: "update-label",
                  label: `label: ${state.count}`,
                })
              }
              style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
              type="button"
              className="px-5 mt-3 btn btn-secondary"
            >{`label: ${state.count}`}</button>
          </div>
        );
      }}
    </MyContextConsumer>
  );
}




export default ComponentTest;