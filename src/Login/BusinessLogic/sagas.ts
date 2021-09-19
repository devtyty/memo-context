import Types from './type';

export default class LoginSaga {
  dispatchReducer: Types.DispatchReducer;
  
  constructor(dispatch: Types.DispatchReducer) {
    this.dispatchReducer = dispatch;
  }

  requestApi(params: LoginSaga.ParamType) {
    ///Request api in here
    ///.........
    ///Update reducer: .....
    this.dispatchReducer({ type: 'increment' });
  }
}

declare namespace LoginSaga {
  interface ParamType {
    ///....Props type
    payload: string;
  }
}
