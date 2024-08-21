// partnerReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Partner } from '../../models/PartnerModels';
import { Branch } from '../../models/BranchModels';

export interface PartnerState {
    partnerData: Partner | null;
    selectedBranch: Branch | null;
}

const initialState: PartnerState = {
    partnerData: null,
    selectedBranch: null,
};

const partnerSlice = createSlice({
    name: 'partner',
    initialState,
    reducers: {
        setPartnerData: (state, action: PayloadAction<Partner>) => {
            state.partnerData = action.payload;
        },
        addBranch: (state, action: PayloadAction<Branch>) => {
            if (state.partnerData) {
                state.partnerData.branches = [...(state.partnerData.branches || []), action.payload];
            }
        },
        updateBranch: (state, action: PayloadAction<Branch>) => {
            if (state.partnerData) {
                const index = state.partnerData.branches.findIndex(branch => branch.branch_id === action.payload.branch_id);
                if (index !== -1) {
                    state.partnerData.branches[index] = action.payload;
                }
            }
        },
        deleteBranch: (state, action: PayloadAction<number>) => {
            if (state.partnerData) {
                state.partnerData.branches = state.partnerData.branches.filter(branch => branch.branch_id !== action.payload);
            }
        },
        setSelectedBranch: (state, action: PayloadAction<Branch | null>) => {
            state.selectedBranch = action.payload;
        },
    }
});

export const { setPartnerData, addBranch, updateBranch, deleteBranch, setSelectedBranch } = partnerSlice.actions;

export default partnerSlice.reducer;
