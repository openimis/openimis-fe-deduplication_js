import {
  graphql,
  formatQuery,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';

const DEDUPLICATION_SUMMARY_FULL_PROJECTION = () => [
  'rows {count, columnValues}',
];

// eslint-disable-next-line import/prefer-default-export
export function fetchDeduplicationSummary(params) {
  const payload = formatQuery('beneficiaryDeduplicationSummary', params, DEDUPLICATION_SUMMARY_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_DEDUPLICATION_SUMMARY);
}
