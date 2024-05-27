import React from "react";
import { Button, Select, MenuItem, Typography } from "@mui/material";
import { paginationOptions } from "@/app/constants/constants";

export default function CustomPagination({
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
}) {
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5 justify-between items-center p-4">
      <div className="flex items-center space-x-2">
        <Typography>عرض</Typography>
        <Select
          value={limit}
          onChange={handleRowsPerPageChange}
          displayEmpty
          inputProps={{ "aria-label": "عدد الصفوف" }}
        >
          {paginationOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Typography>صفوف</Typography>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outlined"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          السابق
        </Button>
        <Typography>
          صفحة {page} من {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
