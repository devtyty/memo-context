import React, { useEffect } from 'react';


/**
 * Types
 */

interface Props {
  children: React.ReactNode;
}

interface SalesRecordState {
  count: number;
  label: string;
};

interface PropsContextState {
  state: SalesRecordState;
  dispatch: Dispatch;
}

interface PropsConsumer {
  children: (context: PropsContextState) => React.ReactNode;
  shouldBuild?: (currentState: SalesRecordState, nextState: SalesRecordState) => boolean;
}

interface PropsSelector {
  children: (context: PropsContextState) => React.ReactNode;
  context: PropsContextState;
}


/**
 * Dispatcher and Actions
 */

type Dispatch = (action: Action) => void;
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'render' } | { type: 'update-label'; label: string; };


/**
 * State management
 */

const initData: SalesRecordState = {
  count: 0,
  label: 'my label',
};


const saleRecordReducer = (state = {...initData}, action: Action): SalesRecordState => {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'decrement':
      if (state.count > 0) {
        state.count--;
        return {
          ...state,
        };
      }
      return state;
    case 'render':
      return {
        ...state,
      }
    case 'update-label':
      return {
        ...state,
        label: action.label,
      }
    default:
      return state;
  }
};



/**
 * Handling context api
 */

const MyContextContext = React.createContext<PropsContextState | undefined>(undefined);


const MyContextProvider = React.memo((props: Props) => {

  const [state, dispatch] = React.useReducer(saleRecordReducer, { ...initData });
  ///State
  const value = { state, dispatch }
  return (
    <MyContextContext.Provider value={value}>
      {props.children}
    </MyContextContext.Provider>
  );
});

function useMyContext() {
  const context = React.useContext(MyContextContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context;
}


const MySelectorComponent = React.memo((props: PropsSelector) => {
  return (
    <>
      {props.children(props.context)}
    </>
  );
});


const MyContextConsumer = React.memo(({ children, shouldBuild }: PropsConsumer) => {
  const context = useMyContext();
  const [myState, setMyState] = React.useState<PropsContextState>(context);


  useEffect(() => {
    if (shouldBuild) {
      if(shouldBuild(myState.state, context.state))
        setMyState(context);
    } else  {
      setMyState(context);
    }
  }, [context]);

  return (
    <MySelectorComponent context={myState}>
      {children}
    </MySelectorComponent>
  )
});

export {MyContextProvider, useMyContext, MyContextConsumer};