import {
  Autocomplete,
  Chip,
  Divider,
  List,
  ListItem,
  ListSubheader,
  Slider,
  TextField,
  Rating,
} from "@mui/material";

interface FiltersProps {
  minStars: number;
  setMinStars: (value: number) => void;
  minMaxPrice: number[];
  setMinMaxPrice: (value: number[]) => void;
  excludedIngredients: string[];
  setExcludedIngredients: (value: string[]) => void;
  ingredients: string[];
}

export const Filters: React.FC<FiltersProps> = ({
  minStars,
  setMinStars,
  setMinMaxPrice,
  minMaxPrice,
  excludedIngredients,
  setExcludedIngredients,
  ingredients,
}) => {
  const minPrice = 0;
  const maxPrice = 200;
  const priceStep = 50;
  const sliderPriceMarks = Array.from(
    { length: (maxPrice + maxPrice - minPrice) / priceStep },
    (_, index) => ({
      value: index * priceStep,
      label: `${index * priceStep} zł`,
    })
  );

  const handlePriceFilter = (
    _: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < priceStep) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], maxPrice - priceStep);
        setMinMaxPrice([clamped, clamped + priceStep]);
      } else {
        const clamped = Math.max(newValue[1], priceStep);
        setMinMaxPrice([clamped - priceStep, clamped]);
      }
    } else {
      setMinMaxPrice(newValue);
    }
  };

  return (
    <List>
      <ListSubheader>Cena</ListSubheader>
      <ListItem>
        <Slider
          value={minMaxPrice}
          onChange={handlePriceFilter}
          getAriaValueText={(num: number) => `${num} zł`}
          disableSwap
          min={minPrice}
          max={maxPrice}
          marks={sliderPriceMarks}
          step={priceStep}
        />
      </ListItem>
      <Divider />

      <ListSubheader>Minimalna ocena</ListSubheader>
      <ListItem>
        <Rating
          value={minStars}
          onChange={(_, value) => {
            setMinStars(value ?? 1);
          }}
        />
      </ListItem>
      <Divider />

      <ListSubheader>Składniki do wykluczenia</ListSubheader>
      <ListItem>
        <Autocomplete
          multiple
          value={excludedIngredients}
          onChange={(_, newValue) => {
            setExcludedIngredients([...newValue]);
          }}
          options={ingredients}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <Chip key={key} label={option} {...tagProps} />;
            })
          }
          fullWidth
          renderInput={(params) => <TextField {...params} />}
        />
      </ListItem>
    </List>
  );
};
