import Types from './type';

export const initLoginState: Types.SalesRecordState = {
  count: 0,
  label: "my label",
};

export const LoginReducer = (
  state = { ...initLoginState },
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
