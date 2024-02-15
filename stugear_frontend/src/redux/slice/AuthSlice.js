import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'account',
  initialState: {
    status: 'idle',
    account: {}
  },
  reducers: {
    createAccount: (state) => {
      console.log(state)
    },
    clearedAccount: (state, action) => {
      state.account = action.payload
    }
  }
})
export default authSlice
