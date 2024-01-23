import {
  graphql,
  formatQuery,
  formatMutation,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';
import { ERROR, REQUEST, SUCCESS } from './util/action-type';

const DEDUPLICATION_SUMMARY_FULL_PROJECTION = () => [
  'rows {count, ids, columnValues}',
];

// eslint-disable-next-line import/prefer-default-export
export function fetchDeduplicationSummary(params) {
  const payload = formatQuery('beneficiaryDeduplicationSummary', params, DEDUPLICATION_SUMMARY_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_DEDUPLICATION_SUMMARY);
}

function formatDeduplicationTasksMutation(summary) {
  if (!summary || !Array.isArray(summary)) {
    return '';
  }

  const formattedSummary = summary.map((item) => {
    const keyValuePairs = Object.entries(item)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');

    return `{ ${keyValuePairs} }`;
  });

  return `summary: [${formattedSummary.join(', ')}]`;
}
export function createDeduplicationTasks(summary, clientMutationLabel) {
  console.log(formatDeduplicationTasksMutation(summary));
  const mutation = formatMutation(
    'createDeduplicationTasks',
    formatDeduplicationTasksMutation(summary),
    clientMutationLabel,
  );
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_DEDUPLICATION_TASKS), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_DEDUPLICATION_TASKS,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}
