import messages_en from "./translations/en.json";
import DeduplicationFieldSelectionDialog from "./components/dialogs/DeduplicationFieldSelectionDialog";

const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messages_en }],
  'deduplication.deduplicationFieldSelectionDialog': [
    DeduplicationFieldSelectionDialog
  ]
}

export const DeduplicationModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}
