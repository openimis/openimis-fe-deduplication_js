import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';
import messagesEn from './translations/en.json';
import DeduplicationFieldSelectionDialog from './components/dialogs/DeduplicationFieldSelectionDialog';
import {
  DeduplicationResolutionItemFormatters,
  DeduplicationResolutionTaskTableHeaders,
} from './components/tasks/DeduplicationResolutionTask';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messagesEn }],
  'deduplication.deduplicationFieldSelectionDialog': [
    DeduplicationFieldSelectionDialog,
  ],
  'tasksManagement.tasks': [{
    text: <FormattedMessage module="deduplication" id="tasks.deduplication.title" />,
    tableHeaders: DeduplicationResolutionTaskTableHeaders,
    itemFormatters: DeduplicationResolutionItemFormatters,
    taskSource: ['BenefitPlanDeduplication'],
  }],
};

// eslint-disable-next-line import/prefer-default-export
export const DeduplicationModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
