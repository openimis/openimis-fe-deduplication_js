/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox,
} from '@material-ui/core';
import {
  FormattedMessage,
} from '@openimis/fe-core';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  table: theme.table,
  tableTitle: theme.table.title,
  tableHeader: theme.table.header,
  tableRow: theme.table.row,
  title: theme.paper.title,
  tableContainer: {
    overflow: 'auto',
  },
  hoverableCell: {
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    cursor: 'pointer',
  },
  selectedCell: {
    backgroundColor: '#a1caf1',
  },
  checkboxCell: {
    textAlign: 'center',
  },
  deactivatedRow: {
    opacity: 0.5,
  },
}));

function BeneficiaryDuplicatesTable({
  headers, rows, setAdditionalData, beneficiaryUuids,
}) {
  const classes = useStyles();
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const additionalData = (
      { values: selectedCells.map((cell) => ({ [cell.header]: cell.value })), beneficiaryIds: beneficiaryUuids }
    );
    // eslint-disable-next-line max-len
    const additionalDataString = `{\\"values\\": ${JSON.stringify(additionalData.values).replace(/"/g, '\\"')},\\"beneficiaryIds\\": ${JSON.stringify(additionalData.beneficiaryIds).replace(/"/g, '\\"')}}`;
    setAdditionalData(additionalDataString);
  }, [selectedCells]);
  const isCellSelected = (rowIndex, header) => selectedCells.some(
    (cell) => cell.rowIndex === rowIndex && cell.header === header,
  );

  const clearCellSelection = (rowIndex, header) => {
    const restCells = selectedCells.filter((cell) => !(cell.rowIndex === rowIndex && cell.header === header));
    setSelectedCells(restCells);
  };

  const clearRowSelection = (rowIndex) => {
    const restCells = selectedCells.filter((cell) => !(cell.rowIndex === rowIndex));
    setSelectedCells(restCells);
  };

  const clearAllCellSelection = () => {
    setSelectedCells([]);
  };

  const checkIfEveryCellInOneRow = (rowIndex) => selectedCells.every((cell) => cell.rowIndex === rowIndex);

  const handleCellClick = (rowIndex, header, value) => {
    if (header === 'individual') {
      return;
    }

    const isCellSelectedInColumn = selectedCells.some((cell) => cell.header === header);
    const isCellClicked = isCellSelected(rowIndex, header);

    if (isCellClicked) {
      clearCellSelection(rowIndex, header);
      return;
    }

    if (isCellSelectedInColumn) {
      const updatedSelectedCells = selectedCells.filter((cell) => cell.header !== header);
      setSelectedCells(updatedSelectedCells);
    }

    setSelectedCells((prevSelectedCells) => [...prevSelectedCells, { rowIndex, header, value }]);

    if (!checkIfEveryCellInOneRow(rowIndex)) {
      setSelectedRow(null);
    }
  };

  const handleCheckboxChange = (rowIndex) => {
    if (selectedRow === rowIndex) {
      clearRowSelection(rowIndex);
      setSelectedRow(null);
    } else {
      clearAllCellSelection();
      const selectedCells = headers
        .filter((header) => header !== 'individual')
        .map((header) => ({ rowIndex, header, value: rows[rowIndex][header] }));
      setSelectedCells(selectedCells);
      setSelectedRow(rowIndex);
    }
  };

  return (
    <div className={classes.tableContainer}>
      <TableContainer className={classes.paper}>
        <Table size="small" className={classes.table} aria-label="dynamic table">
          <TableHead className={classes.header}>
            <TableRow className={classes.header}>
              <TableCell key="checkbox-header" className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.checkbox.header" />
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={classes.tableRow}
              >
                <TableCell key={`checkbox-cell-${rowIndex}`} className={classes.checkboxCell}>
                  <Checkbox
                    color="primary"
                    checked={rowIndex === selectedRow}
                    onChange={() => handleCheckboxChange(rowIndex)}
                  />
                </TableCell>
                {headers.map((header, headerIndex) => (
                  <TableCell
                    key={headerIndex}
                    className={`${isCellSelected(rowIndex, header) ? classes.selectedCell : ''} ${
                      !isCellSelected(rowIndex, header) && header !== 'individual' ? classes.hoverableCell : ''
                    } ${header === 'individual' ? classes.tableDisabledCell : ''}`}
                    onClick={() => handleCellClick(rowIndex, header, row[header])}
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BeneficiaryDuplicatesTable;
