import { Button, Grid, TextField, Typography, Box } from "@mui/material";

import { Fragment, useContext } from "react";

import { WizardContext } from "../../pages/InitSystem";
import { DeliveryPricing } from "../../api";

const handleDeliveryCostChange = (
  index: number,
  field: string,
  value: string,
  deliveryCosts: DeliveryPricing[],
  setDeliveryCosts: (costs: DeliveryPricing[]) => void
) => {
  const newDeliveryCosts = deliveryCosts.slice();
  newDeliveryCosts[index] = { ...newDeliveryCosts[index], [field]: value };
  setDeliveryCosts(newDeliveryCosts);
};

const renderDeliveryCostInputs = (
  deliveryCosts: DeliveryPricing[],
  setDeliveryCosts: (costs: DeliveryPricing[]) => void
) => {
  return (
    <Grid container alignItems="center" spacing={1}>
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
                value={cost.maximumRange}
                required
                onChange={(e) => {
                  handleDeliveryCostChange(
                    index,
                    "maximumRange",
                    e.target.value,
                    deliveryCosts,
                    setDeliveryCosts
                  );
                }}
                fullWidth
                type="number"
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Cena (zł)"
                value={cost.price}
                required
                onChange={(e) => {
                  handleDeliveryCostChange(
                    index,
                    "price",
                    e.target.value,
                    deliveryCosts,
                    setDeliveryCosts
                  );
                }}
                fullWidth
                sx={{ textAlign: "center" }}
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
                    setDeliveryCosts
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
  deliveryCosts: DeliveryPricing[],
  setDeliveryCosts: (costs: DeliveryPricing[]) => void
) => {
  setDeliveryCosts(deliveryCosts.filter((_, i) => i !== index));
};

const handleAddDeliveryCost = (
  deliveryCosts: DeliveryPricing[],
  setDeliveryCosts: (costs: DeliveryPricing[]) => void
) => {
  setDeliveryCosts([...deliveryCosts, { maximumRange: 0, price: 0 }]);
};

export const DeliveryCosts = () => {
  const ctx = useContext(WizardContext);

  return (
    <>
      <Grid container>
        {renderDeliveryCostInputs(ctx.deliveryCosts, ctx.setDeliveryCosts)}
      </Grid>
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            handleAddDeliveryCost(ctx.deliveryCosts, ctx.setDeliveryCosts);
          }}
        >
          Dodaj przedział
        </Button>
      </Box>
    </>
  );
};
