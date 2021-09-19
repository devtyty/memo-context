import React from "react";
import { LoginConsumer, LoginProvider } from "./BusinessLogic";

interface Props {}

const Login: React.FC<Props> = (props: Props) => {
  return (
    <LoginProvider>
      <div>
        <LoginConsumer shouldBuild={(curr, next) => curr.count !== next.count}>
          {({ state, dispatchReducer, sagaController }) => {
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
    </LoginProvider>
  );
};

export default Login;

