export const initLoginState: LoginState = {
  count: 0,
  label: "my label",
};

export const LoginReducer = (
  state = { ...initLoginState },
  action: Action
): LoginState => {
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

  export interface LoginState {
    count: number;
    label: string;
  }

  export type Action =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "update-label"; label: string };

  export type Dispatch = (action: Action) => void;



