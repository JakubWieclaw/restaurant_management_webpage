import { Fragment } from "react";
import { Button, Grid, TextField, Typography, Box } from "@mui/material";

const howManyDeliveryCostsFieldsEmpty = (
  deliveryCosts: { distance: string; price: string }[]
) => {
  let count = 0;
  deliveryCosts.forEach((field: { distance: string; price: string }) => {
    if (field.distance === "") {
      count++;
    }
    if (field.price === "") {
      count++;
    }
  });
  return count;
};

const handleDeliveryCostChange = (
  index: number,
  field: string,
  value: string,
  deliveryCosts: { distance: string; price: string }[],
  setDeliveryCosts: (costs: { distance: string; price: string }[]) => void
) => {
  const newDeliveryCosts = deliveryCosts.slice();
  newDeliveryCosts[index] = { ...newDeliveryCosts[index], [field]: value };
  setDeliveryCosts(newDeliveryCosts);
};

const renderDeliveryCostInputs = (
  deliveryCosts: { distance: string; price: string }[],
  setDeliveryCosts: (costs: { distance: string; price: string }[]) => void,
  deliveryCostsError: string,
  setDeliveryCostsError: (error: string) => void
) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Typography align="center" color="error">
          {deliveryCostsError}&nbsp;
        </Typography>
      </Grid>
      {deliveryCosts.length === 0 ? (
        <Grid item xs={12}>
          <Typography align="center" variant={"h5"}>
            Brak kosztów dostawy
          </Typography>
        </Grid>
      ) : (
        deliveryCosts.map((cost, index) => (
          <Fragment key={"deliveryCost-" + index}>
            <Grid item xs={5}>
              <TextField
                label="Max. odległość od restauracji (km)"
                value={cost.distance}
                onChange={(e) => {
                  if (
                    howManyDeliveryCostsFieldsEmpty(deliveryCosts) === 1 &&
                    cost.distance === ""
                  ) {
                    setDeliveryCostsError("");
                  } // just one previously empty field is now filled
                  handleDeliveryCostChange(
                    index,
                    "distance",
                    e.target.value,
                    deliveryCosts,
                    setDeliveryCosts
                  );
                }}
                fullWidth
                sx={{ my: 1 }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setDeliveryCostsError("Wszystkie pola są wymagane");
                  }
                }}
                type="number"
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Cena"
                value={cost.price}
                onChange={(e) => {
                  if (
                    howManyDeliveryCostsFieldsEmpty(deliveryCosts) === 1 &&
                    cost.price === ""
                  ) {
                    setDeliveryCostsError("");
                  } // just one previously empty field is now filled
                  handleDeliveryCostChange(
                    index,
                    "price",
                    e.target.value,
                    deliveryCosts,
                    setDeliveryCosts
                  );
                }}
                fullWidth
                sx={{ my: 1, textAlign: "center" }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setDeliveryCostsError("Wszystkie pola są wymagane");
                  }
                }}
                type="number"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={2} textAlign={"end"}>
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  handleRemoveDeliveryCost(
                    index,
                    deliveryCosts,
                    setDeliveryCosts,
                    setDeliveryCostsError
                  )
                }
              >
                Usuń
              </Button>
            </Grid>
          </Fragment>
        ))
      )}
    </Grid>
  );
};

const handleRemoveDeliveryCost = (
  index: number,
  deliveryCosts: { distance: string; price: string }[],
  setDeliveryCosts: (costs: { distance: string; price: string }[]) => void,
  setDeliveryCostsError: (error: string) => void
) => {
  let emptyFieldsInCostIndex = 0;
  if (deliveryCosts[index].distance === "") {
    emptyFieldsInCostIndex++;
  }
  if (deliveryCosts[index].price === "") {
    emptyFieldsInCostIndex++;
  }
  setDeliveryCosts(deliveryCosts.filter((_, i) => i !== index));
  if (
    howManyDeliveryCostsFieldsEmpty(deliveryCosts) === emptyFieldsInCostIndex
  ) {
    setDeliveryCostsError("");
  } // just deleted fields was empty
};

const handleAddDeliveryCost = (
  deliveryCosts: { distance: string; price: string }[],
  setDeliveryCosts: (costs: { distance: string; price: string }[]) => void
) => {
  setDeliveryCosts([...deliveryCosts, { distance: "", price: "" }]);
};

interface DeliveryCostsProps {
  deliveryCosts: { distance: string; price: string }[];
  setDeliveryCosts: (costs: { distance: string; price: string }[]) => void;
  deliveryCostsError: string;
  setDeliveryCostsError: (error: string) => void;
}

export const DeliveryCosts: React.FC<DeliveryCostsProps> = ({
  deliveryCosts,
  setDeliveryCosts,
  deliveryCostsError,
  setDeliveryCostsError,
}) => {
  return (
    <>
      <Grid container>
        {renderDeliveryCostInputs(
          deliveryCosts,
          setDeliveryCosts,
          deliveryCostsError,
          setDeliveryCostsError
        )}
      </Grid>
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            handleAddDeliveryCost(deliveryCosts, setDeliveryCosts);
          }}
        >
          Dodaj przedział
        </Button>
      </Box>
    </>
  );
};
