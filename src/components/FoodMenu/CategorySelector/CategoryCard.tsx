import { Typography, Card, Box, CardContent } from "@mui/material";

interface CategoryCardProps {
  category: string;
  icon: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  icon,
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        my: 7,
        mx: 1,
        ":hover": { transform: "scale(1.1)", cursor: "pointer" },
      }}
    >
      <CardContent>
        <Box component="img" src={icon} alt={category} />
        <Typography>{category}</Typography>
      </CardContent>
    </Card>
  );
};
