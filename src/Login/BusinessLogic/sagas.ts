import {Dispatch} from './reducer';

export default class LoginSaga {
  dispatchReducer: Dispatch;
  
  constructor(dispatch: Dispatch) {
    this.dispatchReducer = dispatch;
  }

  requestApi(params: SagaType.ParamType) {
    ///Request api in here
    ///.........
    ///Update reducer: .....
    this.dispatchReducer({ type: 'increment' });
  }
}

export declare namespace SagaType {
  interface ParamType {
    ///....Props type
    payload: string;
  }
}
