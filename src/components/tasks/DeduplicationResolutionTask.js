import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import BeneficiaryDuplicatesTable from '../BeneficiaryDuplicatesTable';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  title: theme.paper.title,
}));

function BeneficiaryDeduplicationTaskDisplay({
  businessData, setAdditionalData,
}) {
  const classes = useStyles();
  const beneficiaryUuids = (businessData?.ids || []).map((id) => id.uuid);
  const beneficiaries = (businessData?.ids || []).map((id) => {
    // eslint-disable-next-line camelcase
    const { individual, json_ext, ...rest } = id;
    return {
      ...rest,
      ...individual,
      // eslint-disable-next-line camelcase
      ...json_ext,
      individual: individual.uuid,
    };
  });

  const headers = businessData?.headers || [];
  const individualIndex = headers.indexOf('individual');

  if (individualIndex !== -1) {
    headers.splice(individualIndex, 1);
    headers.unshift('individual');
  }

  return (
    <div>
      <Typography className={classes.title} style={{ textAlign: 'center' }}>
        {JSON.stringify(businessData?.column_values)}
        {' '}
        ,
        count:
        {' '}
        {businessData?.count}
      </Typography>
      <div>
        <BeneficiaryDuplicatesTable
          headers={headers}
          rows={beneficiaries}
          setAdditionalData={setAdditionalData}
          beneficiaryUuids={beneficiaryUuids}
        />

      </div>
    </div>
  );
}

const DeduplicationResolutionTaskTableHeaders = () => [];

const DeduplicationResolutionItemFormatters = () => [
  (businessData, jsonExt, formatterIndex, setAdditionalData) => (
    <BeneficiaryDeduplicationTaskDisplay
      businessData={businessData}
      setAdditionalData={setAdditionalData}
    />
  ),
];

export { DeduplicationResolutionTaskTableHeaders, DeduplicationResolutionItemFormatters };
