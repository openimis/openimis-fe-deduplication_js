import messagesEn from './translations/en.json';
import DeduplicationFieldSelectionDialog from './components/dialogs/DeduplicationFieldSelectionDialog';
import reducer from './reducer';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messagesEn }],
  reducers: [{ key: 'deduplication', reducer }],
  'deduplication.deduplicationFieldSelectionDialog': [
    DeduplicationFieldSelectionDialog,
  ],
};

// eslint-disable-next-line import/prefer-default-export
export const DeduplicationModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
