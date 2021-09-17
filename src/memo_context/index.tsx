import React, { useEffect } from 'react';
import {initSaleRecord, saleRecordReducer} from './reducer';
import {Types} from './type';



const MyContextContext = React.createContext<Types.PropsContextState | undefined>(undefined);


const MyContextProvider = React.memo((props: Types.PropsProvider) => {

  const [state, dispatch] = React.useReducer(saleRecordReducer, { ...initSaleRecord });
  ///State
  const value = { state, dispatch }
  return (
    <MyContextContext.Provider value={value}>
      {props.children}
    </MyContextContext.Provider>
  );
});

function useMyContext() {
  const context = React.useContext(MyContextContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context;
}



///Effective memo
const MySelectorComponent = React.memo((props: Types.PropsSelector) => {
  return (
    <>
      {props.children(props.context)}
    </>
  );
});


const MyContextConsumer = React.memo(({ children, shouldBuild }: Types.PropsConsumer) => {
  const context = useMyContext();

  ///Holding state
  const [myState, setMyState] = React.useState<Types.PropsContextState>(context);

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