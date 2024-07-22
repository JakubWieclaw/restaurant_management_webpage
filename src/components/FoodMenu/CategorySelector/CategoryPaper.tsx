import { Typography, Card, Box, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

interface CategoryPaperProps {
  category: string;
  icon: string;
}

export const CategoryPaper: React.FC<CategoryPaperProps> = ({
  category,
  icon,
}) => {
  return (
    <Link to="/">
      <Card
        elevation={3}
        sx={{ my: 7, mx: 1 }}
        onClick={() => {
          alert("!clicked");
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
