import React from "react";
import { LoginConsumer, useLogin } from "./BusinessLogic";

interface Props {}

const Login: React.FC<Props> = (props: Props) => {
  return (
      <div>
        <LoginConsumer shouldBuild={(curr, next) => false}>
        {({ state, dispatchReducer, sagaController }) => {
          console.log('render');
            return (
              <div>
                <div>{state.count}</div>
                <button
                  onClick={() =>
                    sagaController.requestApi({ payload: "payload" })
                  }
                  style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
                  type="button"
                  className="px-5 mt-3 btn btn-secondary"
                >
                  Increase
                </button>
                <button
                  onClick={() => dispatchReducer({ type: "decrement" })}
                  style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
                  type="button"
                  className="px-5 mt-3 btn btn-secondary"
                >
                  Decrease
                </button>
              </div>
            );
          }}
        </LoginConsumer>
      </div>
  );
};

export default Login;

