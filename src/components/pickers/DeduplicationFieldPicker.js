import React, { useState } from 'react';
import { useGraphqlQuery, useTranslations, Autocomplete } from '@openimis/fe-core';

function DeduplicationFieldPicker({
  readOnly,
  value,
  onChange,
  required,
  multiple = true,
  placeholder,
  withLabel,
  withPlaceholder,
  label,
  filterOptions,
  filterSelectedOptions,
}) {
  const [searchString, setSearchString] = useState();
  const { formatMessage } = useTranslations('deduplication');

  const { isLoading, data, error } = useGraphqlQuery(
    `
  `,
    { str: searchString },
  );

  const roles = data?.role?.edges.map((edge) => edge.node) ?? [];
  const uniqueValues = [...new Map(value?.map((role) => [role.id, role])).values()];

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder ?? formatMessage('deduplication.deduplicate.fields.placeholder')}
      label={label ?? formatMessage('deduplication.deduplicate.fields')}
      error={error}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={roles}
      isLoading={isLoading}
      value={uniqueValues}
      getOptionLabel={(o) => o?.name}
      onChange={(option) => onChange(option, option?.name)}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={() => setSearchString(searchString)}
    />
  );
}

export default DeduplicationFieldPicker;
