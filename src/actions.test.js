import {
  describe, expect, it, vi,
} from 'vitest';

const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type, meta) => ({ payload, type, meta })),
}));

vi.mock('@openimis/fe-core', async () => ({
  ...(await vi.importActual('@openimis/fe-core/helpers/api')),
  ...core,
}));

const actions = await import('./actions');
const { ACTION_TYPE } = await import('./reducer');
const { ERROR, REQUEST, SUCCESS } = await import('./util/action-type');

const query = (result) => result.payload.replace(/\s+/g, ' ');

describe('deduplication actions', () => {
  it('asks for the duplicate groups of a benefit plan on the chosen columns', () => {
    const result = actions.fetchDeduplicationSummary(['columns: ["first_name","dob"]', 'benefitPlanId: "bp-1"']);

    expect(result.type).toBe(ACTION_TYPE.GET_DEDUPLICATION_SUMMARY);
    expect(query(result)).toContain(
      'beneficiaryDeduplicationSummary(columns: ["first_name","dob"],benefitPlanId: "bp-1")',
    );
    expect(query(result)).toContain('rows {count, ids, columnValues}');
    expect(query(result)).not.toContain('edges');
  });

  describe('createDeduplicationTasks', () => {
    const summary = [
      { count: 2, ids: ['ben-1', 'ben-2'], columnValues: '{"first_name": "Ada"}' },
      { count: 1, ids: ['ben-3'], columnValues: '{"first_name": "Bo"}' },
    ];

    it('sends every duplicate group, keeping the column values a JSON string', () => {
      const sent = query(actions.createDeduplicationTasks(summary, 'Create tasks'));

      expect(sent).toContain('mutation createDeduplicationTasks');
      expect(sent).toContain('clientMutationLabel: "Create tasks"');
      expect(sent).toContain(
        'summary: [{ count: 2, ids: ["ben-1","ben-2"], columnValues: "{\\"first_name\\": \\"Ada\\"}" }, '
        + '{ count: 1, ids: ["ben-3"], columnValues: "{\\"first_name\\": \\"Bo\\"}" }]',
      );
    });

    it.each([
      ['no summary', undefined],
      ['a summary that is not a list', { count: 1 }],
    ])('sends no summary field for %s', (_label, value) => {
      expect(query(actions.createDeduplicationTasks(value, 'Create tasks'))).not.toContain('summary:');
    });

    it('routes the request and failure through the shared mutation types', () => {
      expect(actions.createDeduplicationTasks(summary, 'Create tasks').type).toEqual([
        REQUEST(ACTION_TYPE.MUTATION),
        SUCCESS(ACTION_TYPE.CREATE_DEDUPLICATION_TASKS),
        ERROR(ACTION_TYPE.MUTATION),
      ]);
    });

    it('records the mutation id it sent', () => {
      const result = actions.createDeduplicationTasks(summary, 'Create tasks');

      expect(result.meta).toMatchObject({
        actionType: ACTION_TYPE.CREATE_DEDUPLICATION_TASKS,
        clientMutationLabel: 'Create tasks',
      });
      expect(result.meta.requestedDateTime).toBeInstanceOf(Date);
      expect(query(result)).toContain(`clientMutationId: "${result.meta.clientMutationId}"`);
    });
  });
});
