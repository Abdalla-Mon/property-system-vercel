"use client";
import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Toolbar,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import FullScreenLoader from "@/app/components/Loaders/SpinnerLoader";
import { paginationOptions } from "@/app/constants/constants";
import CustomPagination from "@/app/components/CutsomPagination";

export default function CustomTable({
  columns,
  rows = [], // Default to an empty array
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
  loading,
  total,
  setTotal,
}) {
  const componentRef = useRef();
  const [printMode, setPrintMode] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    columns.reduce((acc, column) => {
      acc[column.field] = column.printable !== false; // Default to printable unless specified otherwise
      return acc;
    }, {}),
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: "@media print { .MuiTablePagination-root { display: none; } }",
    onBeforeGetContent: () => {
      setPrintMode(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setPrintMode(false),
  });

  const handleColumnToggle = (field) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const printableColumns = columns.filter(
    (column) => selectedColumns[column.field] && column.field !== "actions",
  );

  return (
    <Paper className="p-4">
      {loading && <FullScreenLoader />}

      <Toolbar className="flex justify-between">
        <div>
          {columns
            .filter((column) => column.field !== "actions")
            .map((column) => (
              <FormControlLabel
                key={column.field}
                control={
                  <Checkbox
                    checked={selectedColumns[column.field]}
                    onChange={() => handleColumnToggle(column.field)}
                    color="primary"
                  />
                }
                label={column.headerName}
              />
            ))}
        </div>
        <div>
          <IconButton onClick={handlePrint}>
            <PrintIcon />
          </IconButton>
          <IconButton>
            <SaveAltIcon />
          </IconButton>
        </div>
      </Toolbar>
      <TableContainer ref={componentRef}>
        <Table aria-label="custom table">
          <TableHead>
            <TableRow>
              {(printMode ? printableColumns : columns).map((column) => (
                <TableCell
                  key={column.field}
                  className="bg-blue-600"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {(printMode ? printableColumns : columns).map((column) => (
                  <TableCell
                    key={column.field}
                    className="border border-gray-200"
                  >
                    {column.renderCell
                      ? column.renderCell({ row })
                      : column.type === "size"
                        ? row[column.field].length
                        : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomPagination
        setLimit={setLimit}
        limit={limit}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
        total={total}
        setTotal={setTotal}
      />
    </Paper>
  );
}
