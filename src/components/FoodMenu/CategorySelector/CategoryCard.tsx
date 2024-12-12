import { Typography, Card, Box, CardContent } from "@mui/material";
import { photoDownloadUrl } from "../../../utils/api";

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
        ":hover": { transform: "scale(1.1)", cursor: "pointer" },
        transition: "transform 0.3s",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box component="img" src={photoDownloadUrl + icon} alt={category} />
        <Typography>{category}</Typography>
      </CardContent>
    </Card>
  );
};
