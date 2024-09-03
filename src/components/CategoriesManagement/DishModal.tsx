import {
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  TextField,
  FormGroup,
} from "@mui/material";

import { useState, useEffect } from "react";

import { Meal, Category } from "../../api";
import { Transition } from "../../utils/Transision";

interface DishModalProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  dish: Meal | null;
  setDish: (arg0: Meal | null) => void;
  categories: Category[];
  categoryIdx: number;
  setRerenderOnChange: any;
}

export const DishModal: React.FC<DishModalProps> = ({
  open,
  setOpen,
  dish,
  setDish,
  categories,
  categoryIdx,
  setRerenderOnChange,
}) => {
  useEffect(() => {
    setDishCopy(dish);
  }, [dish]);

  const [dishCopy, setDishCopy] = useState<Meal | null>(dish);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dish ? "Danie: " + dish.name : "Nowe danie"}
      </DialogTitle>
      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          if (dishCopy?.id) {
            // update dish
          } else {
            // add dish
          }
          //   setOpen(false);
          //   setRerenderOnChange((prev: boolean) => !prev);
        }}
      >
        <DialogContent id="alert-dialog-slide-description">
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              alignItems: "center",
            }}
          >
            <Box>
              <TextField
                label="Nazwa"
                value={dishCopy?.name ?? " "}
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    name: e.target.value,
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
              />
            </Box>
            <Box>
              <TextField
                label="Cena (zł)"
                value={dishCopy?.price ?? " "}
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    price: Number(e.target.value),
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
              />
            </Box>
            <Box>
              <TextField
                label="Kategoria"
                value={categories[categoryIdx].name ?? " "}
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    categoryId: Number(e.target.value),
                    name: dishCopy?.name ?? "",
                  });
                }}
              />
            </Box>
            <Box>
              <TextField
                label="Zdjęcie"
                value={dishCopy?.photographUrl ?? " "}
                onChange={(e) => {
                  setDishCopy({
                    ...dishCopy,
                    photographUrl: e.target.value,
                    name: dishCopy?.name ?? "",
                    categoryId: dishCopy?.categoryId ?? -1,
                  });
                }}
              />
            </Box>
          </FormGroup>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
