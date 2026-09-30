import {
  describe, expect, it, vi,
} from 'vitest';

vi.mock('@openimis/fe-core', async () => vi.importActual('@openimis/fe-core/helpers/api'));

const { default: reducer, ACTION_TYPE } = await import('./reducer');
const { ERROR, REQUEST, SUCCESS } = await import('./util/action-type');
const { graphqlErrors, serverError } = await import('@openimis/fe-core/testing');

const initial = () => reducer(undefined, { type: '@@INIT' });
const dispatch = (state, type, payload) => reducer(state, { type, payload });

const ROWS = [
  { count: 2, ids: ['ben-1', 'ben-2'], columnValues: '{"first_name": "Ada"}' },
  { count: 3, ids: ['ben-3', 'ben-4', 'ben-5'], columnValues: '{"first_name": "Bo"}' },
];

describe('deduplication reducer', () => {
  it('starts with no summary and nothing in flight', () => {
    expect(initial()).toMatchObject({
      submittingMutation: false,
      fetchingSummary: false,
      fetchedSummary: false,
      errorSummary: null,
      summary: [],
    });
  });

  it('returns the same state object for an unrelated action', () => {
    const state = initial();

    expect(reducer(state, { type: 'SOMETHING_ELSE' })).toBe(state);
  });

  describe('summary', () => {
    it('forgets the previous summary when a fetch starts', () => {
      const stale = { ...initial(), summary: ROWS, fetchedSummary: true };

      expect(dispatch(stale, REQUEST(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY))).toMatchObject({
        fetchingSummary: true,
        fetchedSummary: false,
        summary: null,
      });
    });

    it('keeps the duplicate groups the server found', () => {
      const state = dispatch(initial(), SUCCESS(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY), {
        data: { beneficiaryDeduplicationSummary: { rows: ROWS } },
      });

      expect(state.fetchingSummary).toBe(false);
      expect(state.fetchedSummary).toBe(true);
      expect(state.summary).toEqual(ROWS);
      expect(state.errorSummary).toBeNull();
    });

    it('formats a transport failure', () => {
      const state = dispatch(
        initial(),
        ERROR(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY),
        serverError(500, 'Internal Server Error', 'boom'),
      );

      expect(state.fetchingSummary).toBe(false);
      expect(state.errorSummary).toEqual({ code: 500, message: 'Internal Server Error', detail: 'boom' });
    });

    // Currently fails: the success branch reads beneficiaryDeduplicationSummary.rows
    // unguarded and ignores the errors array, so a resolver error (which nulls the
    // field) throws inside the reducer and the table never leaves its loading state.
    it.fails('surfaces a data error instead of throwing', () => {
      const state = dispatch(initial(), SUCCESS(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY), {
        data: { beneficiaryDeduplicationSummary: null },
        ...graphqlErrors('Unknown column: middle_name'),
      });

      expect(state.fetchingSummary).toBe(false);
      expect(state.errorSummary).toMatchObject({ detail: 'Unknown column: middle_name' });
    });
  });

  it('keeps the internal id once the deduplication tasks are created', () => {
    const state = dispatch(initial(), SUCCESS(ACTION_TYPE.CREATE_DEDUPLICATION_TASKS), {
      data: { createDeduplicationTasks: { internalId: 'internal-1' } },
    });

    expect(state.submittingMutation).toBe(false);
    expect(state.mutation.id).toBe('internal-1');
  });
});
