import { Action, Transaction } from '../types';

// Define the state type
export interface RootState {
  transactions: Transaction[];
}

// Initial state
const initialState: RootState = {
  transactions: [],
};

const reducer = (state = initialState, action: Action<any>): RootState => {
  switch (action.type) {
    // Define your actions
    default:
      return state;
  }
};

export default reducer;
