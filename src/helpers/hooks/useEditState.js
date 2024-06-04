import { useState } from "react";

const useEditState = (initialItems) => {
  const initialSnackbarState = initialItems.reduce((acc, item) => {
    acc[item.name] = false;
    return acc;
  }, {});

  const initialMessageState = initialItems.reduce((acc, item) => {
    acc[item.name] = "";
    return acc;
  }, {});

  const initialEditingState = initialItems.reduce((acc, item) => {
    acc[item.name] = [];
    return acc;
  }, {});
  const [isEditing, setIsEditing] = useState(initialEditingState);
  const [snackbarOpen, setSnackbarOpen] = useState(initialSnackbarState);
  const [snackbarMessage, setSnackbarMessage] = useState(initialMessageState);

  const handleEditBeforeSubmit = () => {
    let allChecksPassed = true;

    initialItems.forEach((item) => {
      if (isEditing[item.name].some((edit) => edit)) {
        setSnackbarOpen((prev) => ({
          ...prev,
          [item.name]: true,
        }));
        setSnackbarMessage((prev) => ({
          ...prev,
          [item.name]: `يرجى حفظ جميع ${item.message}`,
        }));
        allChecksPassed = false;
      }
    });
    return allChecksPassed;
  };

  return {
    isEditing,
    setIsEditing,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    handleEditBeforeSubmit,
  };
};

export default useEditState;
