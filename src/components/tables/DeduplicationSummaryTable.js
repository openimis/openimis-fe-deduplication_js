import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, ProgressOrError, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME } from '../../constants';

const useStyles = makeStyles((theme) => ({
  footer: {
    marginInline: 16,
    marginBlock: 12,
  },
  headerTitle: theme.table.title,
  actionCell: {
    width: 60,
  },
  header: theme.table.header,
}));

const DEDUPLICATION_SUMMARY_HEADERS = [
  'deduplication.deduplicationSummaryTable.group',
  'deduplication.deduplicationSummaryTable.duplicates'
];

function DeduplicationSummaryTable() {
  //const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  //const {
  //  fetchingFamilyMembers, familyMembers, errorFamilyMembers
  //} = useSelector((store) => store.insuree);

  const results = [
    {group: "Firstname: John, Surname: Doe, DOB: 1995-01-2020", duplicates: 2},
    {group: "Firstname: John, Surname: Test, DOB: 1995-01-2020", duplicates: 4},
    {group: "Firstname: Michael, Surname: Doe, DOB: 1995-01-2020", duplicates: 10},
    {group: "Firstname :Dennis, Surname: Jin, DOB: 1994-01-2020", duplicates: 20},
  ];

  //useEffect(() => {
    //if (!insuree) return;

    //dispatch(fetchFamilyMembers(modulesManager, [`familyUuid: "${insuree.family.uuid}"`]));
  //}, [insuree]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead className={classes.header}>
          <TableRow className={classes.headerTitle}>
            {DEDUPLICATION_SUMMARY_HEADERS.map((header) => (
              <TableCell key={header}>
                {' '}
                {formatMessage(header)}
                {' '}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results?.map((result) => (
            <TableRow key={result?.uuid}>
              <TableCell>
                {' '}
                {result.group}
                {' '}
              </TableCell>
              <TableCell>
                {' '}
                {result.duplicates}
                {' '}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DeduplicationSummaryTable;
