
import { Types } from './type';

export interface SalesRecordState {
  count: number;
  label: string;
}

export const initSaleRecord: SalesRecordState = {
  count: 0,
  label: 'my label',
};


export const saleRecordReducer = (state = { ...initSaleRecord }, action: Types.ActionReducer): SalesRecordState => {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'decrement':
      if (state.count > 0) {
        return {
          ...state,
          count: state.count - 1,
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