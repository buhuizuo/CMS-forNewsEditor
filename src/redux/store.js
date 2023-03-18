import { createStore, combineReducers } from "redux";
import collapsedReducer from "./reducers/collapsedReducer";
const reducers = combineReducers({
  collapsedReducer,
});
export default createStore(reducers);
