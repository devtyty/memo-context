#!/bin/sh

# Note variables
# [$PWD] is current directory name

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`


# Generate context api files
function create-context() {

    PATH_FOLDER="$2"
    CONTEXT_NAME="$1"

    if [ "$PATH_FOLDER" != "" -a "$CONTEXT_NAME" != "" ]
    then
        _pathOrigin="$PWD/""$PATH_FOLDER/""$CONTEXT_NAME"
        # Create folder context api
        _pathName="$_pathOrigin/""BusinessLogic"

        rm -rf $_pathOrigin

        mkdir $_pathOrigin
        mkdir $_pathName

        createUIFile

        #Create file index business logic
        createIndex
        createSagas
        createReducer
    else
        tutorial
    fi
}

function createUIFile() {
  cat <<EOT >> $_pathOrigin/index.tsx
import React from "react";
import { ${CONTEXT_NAME}Consumer, ${CONTEXT_NAME}Provider } from "./BusinessLogic";

interface Props {}

const ${CONTEXT_NAME}: React.FC<Props> = (props: Props) => {
  return (
    <${CONTEXT_NAME}Provider>
      <div>
        <${CONTEXT_NAME}Consumer shouldBuild={(curr, next) => curr.count !== next.count}>
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
        </${CONTEXT_NAME}Consumer>
      </div>
    </${CONTEXT_NAME}Provider>
  );
};

export default ${CONTEXT_NAME};


EOT
    echo "${green}Create types file successfully!${reset}"
}

function createIndex() {
    cat <<EOT >> $_pathName/index.tsx
import React from "react";
import {
  DispatchReducer,
  init${CONTEXT_NAME}State,
  ${CONTEXT_NAME}Reducer,
  ${CONTEXT_NAME}State,
} from "./reducer";
import ${CONTEXT_NAME}Saga from "./sagas";

const ${CONTEXT_NAME}Context = React.createContext<Types.PropsContextState>({
  state: { ...init${CONTEXT_NAME}State },
  sagaController: new ${CONTEXT_NAME}Saga(() => null),
  dispatchReducer: () => null,
});

const ${CONTEXT_NAME}Provider = React.memo((props: Types.PropsProvider) => {
  const [state, dispatch] = React.useReducer(${CONTEXT_NAME}Reducer, {
    ...init${CONTEXT_NAME}State,
  });

  ///State
  const value: Types.PropsContextState = {
    state,
    sagaController: new ${CONTEXT_NAME}Saga(dispatch),
    dispatchReducer: dispatch,
  };
  return (
    <${CONTEXT_NAME}Context.Provider value={value}>
      {props.children}
    </${CONTEXT_NAME}Context.Provider>
  );
});

function use${CONTEXT_NAME}Context() {
  const context = React.useContext(${CONTEXT_NAME}Context);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

const ${CONTEXT_NAME}Consumer = React.memo(({ children }: Types.PropsConsumer) => {
  return (
    <${CONTEXT_NAME}Context.Consumer>
      {(state) => children(state)}
    </${CONTEXT_NAME}Context.Consumer>
  );
});

export { ${CONTEXT_NAME}Provider, use${CONTEXT_NAME}Context, ${CONTEXT_NAME}Consumer };

export declare module Types {
  interface PropsProvider {
    children: React.ReactNode;
  }

  interface PropsContextState {
    state: ${CONTEXT_NAME}State;
    dispatchReducer: DispatchReducer;
    sagaController: ${CONTEXT_NAME}Saga;
  }

  interface PropsConsumer {
    children: (context: PropsContextState) => React.ReactNode;
    shouldBuild?: (
      currentState: ${CONTEXT_NAME}State,
      nextState: ${CONTEXT_NAME}State
    ) => boolean;
  }
}

export default Types;


EOT
    echo "${green}Create index file successfully!${reset}"

}

# generate code sagas file
function createSagas() {
  cat <<EOT >> $_pathName/sagas.ts
import { DispatchReducer } from "./reducer";
export default class ${CONTEXT_NAME}Saga {
  dispatchReducer: DispatchReducer;

  constructor(dispatch: DispatchReducer) {
    this.dispatchReducer = dispatch;
  }

  requestApi(params: ${CONTEXT_NAME}Saga.ParamType) {
    ///Request api in here
    ///.........
    ///Update reducer: .....
    this.dispatchReducer({ type: "increment" });
  }
}

declare namespace ${CONTEXT_NAME}Saga {
  interface ParamType {
    ///....Props type
    payload: string;
  }
}

EOT
  echo "${green}Create sagas file successfully!${reset}"
}

function createReducer() {
  cat <<EOT >> $_pathName/reducer.ts
export const init${CONTEXT_NAME}State: ${CONTEXT_NAME}State = {
  count: 0,
  label: "my label",
};

export type DispatchReducer = (action: ActionReducer) => void;
export type ActionReducer =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "render" }
  | { type: "update-label"; label: string };

export interface ${CONTEXT_NAME}State {
  count: number;
  label: string;
}

export const ${CONTEXT_NAME}Reducer = (
  state = { ...init${CONTEXT_NAME}State },
  action: ActionReducer
): ${CONTEXT_NAME}State => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + 1,
      };
    case "decrement":
      if (state.count > 0) {
        return {
          ...state,
          count: state.count - 1,
        };
      }
      return state;
    case "update-label":
      return {
        ...state,
        label: action.label,
      };
    default:
      return state;
  }
};

EOT
    echo "${green}Create reducer file successfully!${reset}"
}


function tutorial() {
  echo "Cú pháp tạo flux architect bằng context api
- SynTax: ${green} create-context <<Tên page hoặc thư mục>> <<Đường dẫn (VD: src/login)>>${reset}
- Ví dụ: ${green} create-context Login src${reset}
"
}

tutorial