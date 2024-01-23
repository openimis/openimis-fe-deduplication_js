// Disabled due to consistency with other modules
/* eslint-disable default-param-last */

import {
  formatServerError,
  dispatchMutationResp,
} from '@openimis/fe-core';
import {
  ERROR, REQUEST, SUCCESS,
} from './util/action-type';

export const ACTION_TYPE = {
  MUTATION: 'MUTATION',
  GET_DEDUPLICATION_SUMMARY: 'DEDUPLICATION_GET_DEDUPLICATION_SUMMARY',
  CREATE_DEDUPLICATION_TASKS: 'CREATE_DEDUPLICATION_TASKS',
};

function reducer(
  state = {
    submittingMutation: false,
    mutation: {},
    fetchingSummary: false,
    errorSummary: null,
    fetchedSummary: false,
    summary: [],
  },
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY):
      return {
        ...state,
        fetchingSummary: true,
        fetchedSummary: false,
        summary: null,
      };
    case SUCCESS(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY):
      return {
        ...state,
        fetchingSummary: false,
        fetchedSummary: true,
        summary: action.payload.data.beneficiaryDeduplicationSummary.rows?.map((row) => ({
          ...row,
        })),
        errorSummary: null,
      };
    case ERROR(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY):
      return {
        ...state,
        fetchingSummary: false,
        errorSummary: formatServerError(action.payload),
      };
    case SUCCESS(ACTION_TYPE.CREATE_DEDUPLICATION_TASKS):
      return dispatchMutationResp(state, 'createDeduplicationTasks', action);
    default:
      return state;
  }
}

export default reducer;
