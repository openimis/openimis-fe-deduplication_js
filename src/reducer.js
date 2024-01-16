// Disabled due to consistency with other modules
/* eslint-disable default-param-last */

import {
  parseData,
  formatServerError,
} from '@openimis/fe-core';
import {
  ERROR, REQUEST, SUCCESS,
} from './util/action-type';

export const ACTION_TYPE = {
  GET_DEDUPLICATION_SUMMARY: 'DEDUPLICATION_GET_DEDUPLICATION_SUMMARY',
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
    default:
      return state;
  }
}

export default reducer;
