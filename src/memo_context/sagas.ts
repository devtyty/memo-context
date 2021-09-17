import Types from './type';


export default class SaleRecordSaga {
  dispatchReducer: Types.DispatchReducer;
  
  constructor(dispatch: Types.DispatchReducer) {
    this.dispatchReducer = dispatch;
  }

  requestApi(params: SaleRecordSaga.ParamType) {
    ///Request api in here
    ///.........
    ///Update reducer: .....
    this.dispatchReducer({ type: 'increment' });
  }
}

declare namespace SaleRecordSaga {
  interface ParamType {
    ///....Props type
    payload: string;
  }
}