import { Typography, Card, Box, CardContent, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface CategoryCardProps {
  category: string;
  icon: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
}) => {
  return (
    <Link component={RouterLink} to="/" underline="none">
      <Card
        elevation={3}
        sx={{ my: 7, mx: 1 }}
        onClick={() => {
          alert("clicked!");
        }}
      >
        <CardContent>
          <Box component="img" src={icon} alt={category} />
          <Typography>{category}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};
