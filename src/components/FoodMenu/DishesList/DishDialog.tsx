import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Typography,
  Button,
} from "@mui/material";

import { Dish } from "../../../types/dish";
import { IncrementDecrementNumberInput } from "../../inputs/IncrementDecrementNumberInput";

interface DishDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  dish: Dish | undefined;
  quantity: number;
  setQuantity: (quantity: number) => void;
  removedIngredients: string[];
  setRemovedIngredients: (removedIngredients: string[]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
}

export const DishDialog: React.FC<DishDialogProps> = ({
  open,
  setOpen,
  dish,
  quantity,
  setQuantity,
  removedIngredients,
  setRemovedIngredients,
  onSubmit,
  submitLabel,
}) => {
  if (dish)
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if ((event.nativeEvent as any).submitter.name === "submit_btn") {
              onSubmit(event);
              setOpen(false);
            }
          },
        }}
      >
        <DialogTitle>
          <Typography sx={{ textAlign: "center", m: 1, fontSize: 35 }}>
            {}
            {dish.name} - {dish.price} zł
          </Typography>
          <Box
            component="img"
            src={dish.image}
            sx={{
              height: 300,
              width: "100%",
              objectFit: "cover",
            }}
          ></Box>
        </DialogTitle>
        <Divider />

        <DialogContent>
          <DialogContentText>Liczba sztuk</DialogContentText>
          <FormGroup sx={{ m: 1 }}>
            <IncrementDecrementNumberInput
              value={quantity}
              setValue={setQuantity}
            />
          </FormGroup>

          <DialogContentText>Modyfikuj składniki</DialogContentText>
          <FormGroup sx={{ my: 2 }}>
            {dish.ingredients.map((ingredient) => (
              <FormControlLabel
                key={ingredient}
                name={ingredient}
                defaultChecked
                label={ingredient}
                control={
                  <Checkbox
                    name={ingredient}
                    color="primary"
                    checked={!removedIngredients.includes(ingredient)}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      if (checked) {
                        setRemovedIngredients(
                          removedIngredients.filter(
                            (removedIngredient) =>
                              removedIngredient !== ingredient
                          )
                        );
                      } else {
                        setRemovedIngredients([
                          ...removedIngredients,
                          ingredient,
                        ]);
                      }
                    }}
                  />
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{ display: "flex", justifyContent: "center", my: 1 }}
        >
          <Button type="submit" variant="contained" name="submit_btn">
            {submitLabel} - {(quantity * dish.price).toFixed(2)} zł
          </Button>
        </DialogActions>
      </Dialog>
    );
};
