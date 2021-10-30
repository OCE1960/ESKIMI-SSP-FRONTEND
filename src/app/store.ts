import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import CampaignReducer from "../features/campaignSlice"


export const store = configureStore({
  reducer: {
    campaigns: CampaignReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
