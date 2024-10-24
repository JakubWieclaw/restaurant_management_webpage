import { BarChart } from "@mui/x-charts/BarChart";
import {
  Autocomplete,
  Grid,
  TextField,
  Container,
  Divider,
  Typography,
  Slider,
} from "@mui/material";

import { useEffect, useState } from "react";

import { customersApi, statsApi } from "../utils/api";
import { Customer } from "../api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { LineChart } from "@mui/x-charts";

export const AdminPanel = () => {
  useEffect(() => {
    customersApi.getAllCustomers().then((res: AxiosResponse) => {
      setAllCustomers(res.data);
    });
    statsApi.getEarningsByYearMonth().then((res: AxiosResponse) => {
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
    statsApi.getOrdersByDayAndHour().then((res: AxiosResponse) => {
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

  const [itemNbEarnings, setItemNbEarnings] = useState<number>(5);
  const [itemNbOrders, setItemNbOrders] = useState<number>(5);
  const [allCustomers, setAllCustomers] = useState([]);
  const [ordersByDayHour, setOrdersByDayHour] = useState<
    { dayHour: string; data: number[] }[]
  >([]);
  const [earningsByYearMonth, setEarningsByYearMonth] = useState<
    { month: string; data: number[] }[]
  >([]);

  const navigate = useNavigate();

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
        </Grid>
      </Container>
    </div>
  );
};
