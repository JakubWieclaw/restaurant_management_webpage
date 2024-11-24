import { BarChart } from "@mui/x-charts/BarChart";
import {
  Autocomplete,
  Grid,
  TextField,
  Container,
  Divider,
  Typography,
  Slider,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { useEffect, useState } from "react";

import { auth, customersApi, statsApi } from "../utils/api";
import { Customer } from "../api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { IncrementDecrementNumberInput } from "../components/inputs/IncrementDecrementNumberInput";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const AdminPanel = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [itemNbOrders, setItemNbOrders] = useState<number>(5);
  const [itemNbEarnings, setItemNbEarnings] = useState<number>(5);
  const [rateMealsNumber, setRateMealsNumber] = useState<number>(5);
  const [rateMealsCategory, setRateMealsCategory] = useState<string>("best");
  const [rateMealsList, setRateMealsList] = useState<Record<string, number>>(
    {}
  );
  const [orderMealsNumber, setOrderMealsNumber] = useState<number>(5);
  const [orderMealsCategory, setOrderMealsCategory] = useState<string>("most");
  const [orderMealsList, setOrderMealsList] = useState<Record<string, number>>(
    {}
  );
  const [ordersByDayHour, setOrdersByDayHour] = useState<
    { dayHour: string; data: number[] }[]
  >([]);
  const [earningsByYearMonth, setEarningsByYearMonth] = useState<
    { month: string; data: number[] }[]
  >([]);

  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    customersApi.getAllCustomers(auth(user?.loginResponse?.token)).then((res: AxiosResponse) => {
      setAllCustomers(res.data);
    });
    statsApi.getEarningsByYearMonth(auth(user?.loginResponse?.token)).then((res: AxiosResponse) => {
      if (typeof res.data === "string") {
        setItemNbEarnings(0);
        return;
      }
      let series: { month: string; data: number[] }[] = [];
      Object.keys(res.data)
        .reverse()
        .forEach((key) => {
          series.push({
            month: key,
            data: [res.data[key] as number],
          });
        });
      if (series.length < itemNbEarnings) {
        setItemNbEarnings(series.length);
      }
      setEarningsByYearMonth(series);
    });
    statsApi.getOrdersByDayAndHour(auth(user?.loginResponse?.token)).then((res: AxiosResponse) => {
      if (typeof res.data === "string") {
        setItemNbOrders(0);
        return;
      }
      let series: { dayHour: string; data: number[] }[] = [];
      Object.keys(res.data).forEach((key) => {
        series.push({
          dayHour: key,
          data: [res.data[key] as number],
        });
      });
      if (series.length < itemNbOrders) {
        setItemNbOrders(series.length);
      }
      setOrdersByDayHour(series);
    });
  }, []);

  useEffect(() => {
    statsApi
      .getBestWorstRatedMeals(rateMealsCategory, rateMealsNumber, auth(user?.loginResponse?.token))
      .then((res: AxiosResponse) => {
        if (typeof res.data === "string") {
          toast.error(res.data, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        } else {
          setRateMealsList(res.data);
        }
      }).catch((error) => {
        toast.error(error.response.data, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } );
    statsApi
      .getMostPopularMeals(orderMealsCategory, orderMealsNumber, auth(user?.loginResponse?.token))
      .then((res: AxiosResponse) => {
        if (typeof res.data === "string") {
          toast.error(res.data, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        } else {
        setOrderMealsList(res.data);
        }
      }).catch((error) => {
        toast.error(error.response.data, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } );
  }, [
    rateMealsNumber,
    rateMealsCategory,
    orderMealsNumber,
    orderMealsCategory,
  ]);

  return (
    <div>
      <Container sx={{ mt: 15 }} maxWidth="lg">
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Panel administracyjny
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography component="h2" variant="h5" align="right" gutterBottom>
              <Autocomplete
                options={allCustomers}
                getOptionLabel={(option: Customer) =>
                  `(${option.id}) ${option.name} ${option.surname}`
                }
                onChange={(_, value: Customer | null) => {
                  if (value) {
                    navigate(`/customer-details/${value.id}`);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Wyszukaj klienta"
                    variant="outlined"
                    sx={{
                      width: "25%",
                      my: 1,
                    }}
                    size="small"
                  />
                )}
              />
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "50%",
              }}
            >
              <Typography
                component="h2"
                variant="h5"
                align="center"
                gutterBottom
              >
                Sumaryczna wartość zamówień w zależności od roku i miesiąca
              </Typography>
              <Typography
                id="input-item-number"
                gutterBottom
                sx={{
                  mt: 5,
                }}
              >
                Liczba ostatnich miesięcy: {itemNbEarnings}
              </Typography>
              <Slider
                value={itemNbEarnings}
                onChange={(_, value: number | number[]) =>
                  setItemNbEarnings(Array.isArray(value) ? value[0] : value)
                }
                valueLabelDisplay="auto"
                min={0}
                max={earningsByYearMonth.length}
                aria-labelledby="input-item-number"
              />
            </Box>
            <LineChart
              height={300}
              xAxis={[
                {
                  scaleType: "band",
                  data: earningsByYearMonth
                    .map((e) => e.month)
                    .slice(0, itemNbEarnings),
                },
              ]}
              series={[
                {
                  data: earningsByYearMonth
                    .map((e) => e.data[0])
                    .slice(0, itemNbEarnings),
                },
              ]}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "50%",
              }}
            >
              <Typography
                component="h2"
                variant="h5"
                align="center"
                gutterBottom
              >
                Liczba zamówień w zależności od dnia i godziny
              </Typography>
              <Typography
                id="input-item-number-orders"
                gutterBottom
                sx={{
                  mt: 5,
                }}
              >
                Liczba ostatnich godzin: {itemNbOrders}
              </Typography>
              <Slider
                value={itemNbOrders}
                onChange={(_, value: number | number[]) =>
                  setItemNbOrders(Array.isArray(value) ? value[0] : value)
                }
                valueLabelDisplay="auto"
                min={0}
                max={ordersByDayHour.length}
                aria-labelledby="input-item-number-orders"
              />
            </Box>
            <BarChart
              height={300}
              xAxis={[
                {
                  scaleType: "band",
                  data: ordersByDayHour
                    .map((e) => e.dayHour)
                    .slice(0, itemNbOrders),
                },
              ]}
              series={[
                {
                  data: ordersByDayHour
                    .map((e) => e.data[0])
                    .slice(0, itemNbOrders),
                },
              ]}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              Oceny posiłków
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                id="input-rate-meals"
                gutterBottom
                sx={{ mt: 1, mx: 2 }}
              >
                Pokaż
              </Typography>
              <IncrementDecrementNumberInput
                value={rateMealsNumber}
                setValue={setRateMealsNumber}
              />
              <Typography
                id="input-rate-meals"
                gutterBottom
                sx={{ mt: 1, mx: 2 }}
              >
                pierwszych
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Select
                value={rateMealsCategory}
                onChange={(e) => setRateMealsCategory(e.target.value)}
                sx={{
                  mx: 2,
                }}
              >
                <MenuItem value={"best"}>najlepiej</MenuItem>
                <MenuItem value={"worst"}>najgorzej</MenuItem>
              </Select>
              ocenianych posiłkow.
            </Box>

            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                mt: 5,
              }}
            >
              {Object.keys(rateMealsList).map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={`${key}`}
                      secondary={`Średnia ocena: ${rateMealsList[key]}`}
                    />
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              Zamówienia posiłków
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                id="input-order-meals"
                gutterBottom
                sx={{ mt: 1, mx: 2 }}
              >
                Pokaż
              </Typography>
              <IncrementDecrementNumberInput
                value={orderMealsNumber}
                setValue={setOrderMealsNumber}
              />
              <Typography
                id="input-order-meals"
                gutterBottom
                sx={{ mt: 1, mx: 2 }}
              >
                pierwszych
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Select
                value={orderMealsCategory}
                onChange={(e) => setOrderMealsCategory(e.target.value)}
                sx={{
                  mx: 2,
                }}
              >
                <MenuItem value={"most"}>najczęściej</MenuItem>
                <MenuItem value={"least"}>najrzadziej</MenuItem>
              </Select>
              zamawianych posiłkow.
            </Box>

            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                mt: 5,
              }}
            >
              {Object.keys(orderMealsList).map((key) => (
                <>
                  <ListItem key={key}>
                    <ListItemText
                      primary={`${key}`}
                      secondary={`Liczba zamówień: ${orderMealsList[key]}`}
                    />
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
