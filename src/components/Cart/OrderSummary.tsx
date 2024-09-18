import { Box, Divider, Typography, List } from "@mui/material";

import { useSelector } from "react-redux";

import { RootState } from "../../store";

interface ContentSummaryProps {
  shippingCost: number;
}

export const ContentSummary: React.FC<ContentSummaryProps> = ({
  shippingCost,
}) => {
  const cart = useSelector((state: RootState) => state.cart);

  const mealsCost = cart.items.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0
  );
  const total = mealsCost + shippingCost;

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Posiłki</Typography>
        <Typography variant="body1">{mealsCost.toFixed(2)} zł</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Dostawa</Typography>
        <Typography variant="body1">{shippingCost.toFixed(2)} zł</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body1">Łącznie</Typography>
        <Typography variant="body1">{total.toFixed(2)} zł</Typography>
      </Box>
    </List>
  );
};
