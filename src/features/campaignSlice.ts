import { createSlice,  createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../app/store';

 export type campaignType = {
  id: string,
  name: string,
  from: string,
  to: string,
  daily_budget: number,
  total_budget: number,
  created_at: string,
  updated_at: string,

}; 

export type fileType = {
  id: string,
  advertising_campaign_id: number,
  file_path: string,
  created_at: string,
  updated_at: string,
}; 

export const campaignRecord :campaignType = {
  id: "",
  name: "",
  from: "",
  to: "",
  daily_budget: 0,
  total_budget: 0,
  created_at: "",
  updated_at: "",
}; 

const campaigns: campaignType[]= [] ;
const fileRecords : fileType[] = [];

const initialState = {
  campaignRecord,
  fileRecords ,
  campaigns,
  status: 'idle',
}




export const getCampaigns = createAsyncThunk('campaign/list', async () => {
            const campaigns = await axios.get(`/campaign`);
            //console.log(campaigns);
            return await campaigns;    
})
export const store = createAsyncThunk('campaign/store', async (values: any) => {       
  const storeResponse = await axios.post(`/campaign`, values);
  return await storeResponse.data;    
})
export const update = createAsyncThunk('campaign/update', async (values: any ) => {  
  const id = values.get('id');     
  const updateResponse = await axios.post(`/campaign/${id}`, values); 
  return await updateResponse.data;    
})

export const getCampaignById = createAsyncThunk('campaign/view', async (id: string) => {
  const response = await axios.get(`/campaign/view/${id}`)
  return await response.data;
})



export const campaignSlice = createSlice({
    name: 'campaigns',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getCampaigns.pending, (state, action) => {
          state.status = 'pending'
        }).addCase(getCampaigns.fulfilled, (state, action) => {
            if(state.status === 'pending'){
              state.status = 'idle';
              if(action.payload.hasOwnProperty('statusText') && action.payload.statusText === "OK" ){
                state.status = 'succeeded';
                 state.campaigns = action.payload.data.campaigns;
                //console.log(action.payload.data)
              }else {
                console.log(action.payload)
                state.status = 'failed';
              }
              
                
            }  
          }).addCase(getCampaigns.rejected, (state, action) => {
            console.log(action)
            state.status = 'failed';
          }).addCase(store.pending, (state, action) => {
            state.status = 'pending'
          }).addCase(store.fulfilled, (state, action) => {
                  if(state.status === 'pending'){
                    if(action.payload.hasOwnProperty('success') && action.payload.success === true  ){
                      state.status = 'idle';
                    }else {
                      state.status = 'failed';
                    }
                  }  
                }).addCase(store.rejected, (state) => {
                  state.status = 'failed';
          }).addCase(update.pending, (state) => {
                  state.status = 'pending'
              }).addCase(update.fulfilled, (state, action) => {
              // if(state.status === 'pending'){
                  if(action.payload.hasOwnProperty('success') && action.payload.success === true  ){
                    state.status = 'succeeded';
                  }else {
                    state.status = 'failed';
                  }
                //}  
              }).addCase(update.rejected, (state) => {
                state.status = 'failed';
        }).addCase(getCampaignById.pending, (state) => {
                state.status = 'pending'
              }).addCase(getCampaignById.fulfilled, (state, action) => {
                //if(state.status === 'pending'){
                  if(action.payload.hasOwnProperty('success') && action.payload.success === true  ){
                    state.status = 'succeeded';
                    // console.log(action.payload);
                    state.campaignRecord= action.payload.campaign;
                    state.fileRecords= action.payload.files;
                  }else {
                    state.status = 'failed';
                    state.campaignRecord = campaignRecord;
                    state.fileRecords = fileRecords;
                  }
                //}  
              }).addCase(getCampaignById.rejected, (state) => {
                state.status = 'failed';
                state.campaignRecord = campaignRecord;
                state.fileRecords = fileRecords;
        })
      },
})

//export const { } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectListOfCampaigns  = (state: RootState) => state.campaigns.campaigns; 
export const selectCampaignStatus = (state: RootState) => state.campaigns.status;
export const selectCampaignRecord = (state: RootState) => state.campaigns.campaignRecord;
export const selectCampaignFiles = (state: RootState) => state.campaigns.fileRecords;



export default campaignSlice.reducer;