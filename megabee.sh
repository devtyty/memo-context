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
        createTypes
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
import React, { useEffect } from "react";
import { init${CONTEXT_NAME}State, ${CONTEXT_NAME}Reducer } from "./reducer";
import ${CONTEXT_NAME}Saga from "./sagas";
import Types from "./type";

const ${CONTEXT_NAME}Context = React.createContext<
  Types.PropsContextState | undefined
>(undefined);

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

function use${CONTEXT_NAME}() {
  const context = React.useContext(${CONTEXT_NAME}Context);
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
 * \`\`\`
  * <${CONTEXT_NAME}Consumer
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
                  label: \`label: \${Date.now()}\`,
                })
              }
              style={{ backgroundColor: "#D4D4D4", borderColor: "#D4D4D4" }}
              type="button"
              className="px-5 mt-3 btn btn-secondary"
            >{'label'}</button>
          </div>
        );
      }}
    </${CONTEXT_NAME}Consumer>
 * \`\`\`
*/
const ${CONTEXT_NAME}Consumer = React.memo(
  ({ children, shouldBuild }: Types.PropsConsumer) => {
    const context = use${CONTEXT_NAME}();

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

export { ${CONTEXT_NAME}Provider, use${CONTEXT_NAME}, ${CONTEXT_NAME}Consumer };

EOT
    echo "${green}Create index file successfully!${reset}"

}

# generate code sagas file
function createSagas() {
  cat <<EOT >> $_pathName/sagas.ts
import Types from './type';

export default class ${CONTEXT_NAME}Saga {
  dispatchReducer: Types.DispatchReducer;
  
  constructor(dispatch: Types.DispatchReducer) {
    this.dispatchReducer = dispatch;
  }

  requestApi(params: ${CONTEXT_NAME}Saga.ParamType) {
    ///Request api in here
    ///.........
    ///Update reducer: .....
    this.dispatchReducer({ type: 'increment' });
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
import Types from './type';

export const init${CONTEXT_NAME}State: Types.SalesRecordState = {
  count: 0,
  label: "my label",
};

export const ${CONTEXT_NAME}Reducer = (
  state = { ...init${CONTEXT_NAME}State },
  action: Types.ActionReducer
): Types.SalesRecordState => {
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

function createTypes() {
  cat <<EOT >> $_pathName/type.ts
import ${CONTEXT_NAME}Saga from "./sagas";

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
    sagaController: ${CONTEXT_NAME}Saga;
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

EOT
    echo "${green}Create types file successfully!${reset}"
}



function tutorial() {
  echo "Cú pháp tạo flux architect bằng context api
- SynTax: ${green} create-context <<Tên page hoặc thư mục>> <<Đường dẫn (VD: src/${CONTEXT_NAME})>>${reset}
- Ví dụ: ${green} create-context ${CONTEXT_NAME} src${reset}
"
}

tutorial