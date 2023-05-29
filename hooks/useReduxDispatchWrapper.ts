import { fail, pending } from "@/redux/modules/searched";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Action, ActionFunctionAny } from "redux-actions";

function useReduxDispatchWrapper() {
  const dispatch = useDispatch();
  const dispatchWrapper = useCallback(
    (action: ActionFunctionAny<Action<any>>, payload: any) => {
      try {
        dispatch(pending());
        dispatch(action(payload));
      } catch (err) {
        dispatch(fail(err));
      }
    },
    []
  );

  return { dispatchWrapper };
}

export default useReduxDispatchWrapper;
