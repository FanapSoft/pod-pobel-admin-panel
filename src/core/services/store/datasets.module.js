// action types
export const FETCH_DATASET = "fetchDataset";
export const LOAD_DATASET = "getDatasetById";

// mutation types
export const CACHE_DATASET = "cacheDataset";
export const SET_CURRENT_DATASET = "setCurrentDataset"

const state = {
    datasets: [],
    currentDataset: null
};

const getters = {
    datasets(state) {
        return state.datasets;
    },
    currentDataset(state) {
        return state.currentDataset;
    },
    dataset: state => id => {
        return state.datasets.filter(item => item.id === id)[0]
    }
};

const actions = {
    async [LOAD_DATASET](context, id) {
        let ds = context.state.datasets.filter(item => item.id == id);
        ds = ds && ds.length ? ds[0] : await context.dispatch(FETCH_DATASET, id);
        context.commit(SET_CURRENT_DATASET, ds);
    },
    async [FETCH_DATASET](context, id) {
        const data = {
            id: id
        };

        try {
            const ds = await this._vm.$http.get(this._vm.$utils.addParamsToUrl(`/api/services/app/Datasets/Get`, data));
            if(ds.data && ds.data.result) {
                context.commit(CACHE_DATASET, ds.data.result);
                return ds.data.result;
            }
        } catch (error) {
            console.log(error);
        }
    }
};

const mutations = {
    [CACHE_DATASET](state, ds) {
        state.datasets.push(ds)
    },
    [SET_CURRENT_DATASET](state, ds) {
        state.currentDataset = ds;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
