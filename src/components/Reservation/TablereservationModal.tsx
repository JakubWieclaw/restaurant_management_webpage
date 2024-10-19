import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface TableReservationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TableReservationModal = ({
  open,
  setOpen,
}: TableReservationModalProps) => {
  const handleTableAdding = async () => {
    setTableAddingLoading(true);
    try {
      await addTable(tableID, tableSeats);
      setTableID("");
      setTableSeats(1);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setTableAddingLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Dodaj stolik</DialogTitle>
      <DialogContent>
        <TextField
          label="ID stolika"
          variant="outlined"
          fullWidth
          value={tableID}
          onChange={(e) => setTableID(e.target.value)}
          sx={{
            mt: 2,
          }}
        />
        <TextField
          label="Liczba miejsc"
          variant="outlined"
          type="number"
          fullWidth
          value={tableSeats}
          onChange={(e) => setTableSeats(parseInt(e.target.value))}
          sx={{
            mt: 2,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          onClick={handleTableAdding}
          color="primary"
          disabled={tableAddingLoading}
        >
          {tableAddingLoading ? <CircularProgress size={24} /> : "Dodaj stolik"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
