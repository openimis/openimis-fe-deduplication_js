import React from 'react';

function BeneficiaryDeduplicationTaskDisplay({
  businessData,
}) {
  return (
    <div>
      <div>
        {JSON.stringify(businessData.column_values)}
        {' '}
        ,
        count:
        {' '}
        {businessData.count}
      </div>
      <div>
        headers
      </div>
      <div>
        {businessData.ids.map((id) => <div>{id}</div>)}
      </div>
    </div>
  );
}

const DeduplicationResolutionTaskTableHeaders = () => [];

const DeduplicationResolutionItemFormatters = () => [
  (businessData) => <BeneficiaryDeduplicationTaskDisplay businessData={businessData} />,
];

export { DeduplicationResolutionTaskTableHeaders, DeduplicationResolutionItemFormatters };
