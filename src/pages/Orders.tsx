import {
  Container,
  Divider,
  TableContainer,
  Paper,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  IconButton,
  Box,
  Collapse,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

import { AxiosResponse } from "axios";
import { useState, useEffect, Fragment } from "react";

import { mealsApi, orderApi } from "../utils/api";

export const Orders = () => {
  const [open, setOpen] = useState<boolean[]>([]);
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState<Record<number, any>>({});

  useEffect(() => {
    orderApi.getAllOrders().then((response: AxiosResponse) => {
      setOrders(response.data);
      response.data.forEach((_: any) => {
        setOpen((prevOpen) => {
          return [...prevOpen, false];
        });
      });
    });
  }, []);

  return (
    <Container sx={{ mt: 15 }} maxWidth="md">
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Zamówienia klientów
      </Typography>
      <Divider
        sx={{
          mb: 2,
        }}
      />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID zamówienia</TableCell>
              <TableCell align="right">ID klienta</TableCell>
              <TableCell align="right">Data i godzina</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {orders.map((order: any, idx) => (
                <Fragment key={order.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() =>
                          setOpen(
                            open.map((val, i) => {
                              if (i === idx) {
                                return !val;
                              }
                              return val;
                            })
                          )
                        }
                      >
                        {open[idx] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {order.id}
                    </TableCell>
                    <TableCell align="right">{order.customerId}</TableCell>
                    <TableCell align="right">
                      {order.dateTime.substring(0, 19).replace("T", " ")}
                    </TableCell>
                    <TableCell align="right">{order.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse in={open[idx]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Szczegóły zamówienia
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableRow>
                                <TableCell>Danie</TableCell>
                                <TableCell>Liczba sztuk</TableCell>
                                <TableCell align="right">
                                  Usunięte składniki
                                </TableCell>
                                <TableCell align="right">
                                  Łączna cena (PLN)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.mealIds.map(
                                (meal: any, mealIdx: number) => {
                                  if (!(meal.mealId in meals)) {
                                    mealsApi
                                      .getMealById(meal.mealId)
                                      .then((response: AxiosResponse) => {
                                        setMeals((prevMeals) => {
                                          return {
                                            ...prevMeals,
                                            [meal.mealId]: response.data,
                                          };
                                        });
                                      });
                                  }

                                  return (
                                    <TableRow key={`meal${meal.mealId}`}>
                                      <TableCell component="th" scope="row">
                                        {meal.mealId in meals
                                          ? meals[meal.mealId].name
                                          : "Ładowanie..."}
                                      </TableCell>
                                      <TableCell>{meal.quantity}</TableCell>
                                      <TableCell align="right">
                                        {order.unwantedIngredients
                                          .filter(
                                            (unwanted: any) =>
                                              unwanted.mealIndex === mealIdx
                                          )
                                          .map((unwanted: any) =>
                                            unwanted.ingredients.join(", ")
                                          )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {" "}
                                        {meal.mealId in meals
                                          ? (
                                              meals[meal.mealId].price *
                                              meal.quantity
                                            ).toFixed(2)
                                          : "Ładowanie..."}
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              )}
                              <TableRow key="summary">
                                <TableCell component="th" scope="row">
                                  -
                                </TableCell>
                                <TableCell>-</TableCell>
                                <TableCell align="right">-</TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  {order.totalPrice.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
