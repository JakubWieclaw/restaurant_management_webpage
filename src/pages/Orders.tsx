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
  MenuItem,
  Select,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

import { AxiosResponse } from "axios";
import { useState, useEffect, Fragment } from "react";

import { mealsApi, orderApi } from "../utils/api";
import { Order, OrderStatusEnum, OrderTypeEnum } from "../api";
import { toast } from "react-toastify";

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [meals, setMeals] = useState<Record<number, any>>({});
  const [chosenOrdersStatus, setChosenOrdersStatus] = useState<string>(
    OrderStatusEnum.Oczekujce
  );
  const [reloadOrders, setReloadOrders] = useState<boolean>(false);

  useEffect(() => {
    orderApi.getAllOrders().then((response: AxiosResponse) => {
      setOrders(response.data);
      setOpen((prev) => {
        // as previous and add order with false value
        return {
          ...prev,
          ...response.data.reduce(
            (_: Record<number, boolean>, _order: Order) => {
              return {
                [_order.id!]: prev[_order.id!] ?? false,
              };
            },
            {}
          ),
        };
      });
    });
  }, [reloadOrders]);

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
      <TabContext value={chosenOrdersStatus}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TabList
            onChange={(_event, newValue) => {
              setChosenOrdersStatus(newValue);
            }}
          >
            {/* for every status in OrderStatusEnum */}
            {Object.values(OrderStatusEnum).map((status) => (
              <Tab
                key={status}
                label={status.replaceAll("_", " ")}
                value={status}
              />
            ))}
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
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
              {orders
                .filter((order: Order) => order.status === chosenOrdersStatus)
                .map((order: Order) => (
                  <Fragment key={order.id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() =>
                            setOpen((prev) => ({
                              ...prev,
                              [order.id!]: !prev[order.id!],
                            }))
                          }
                        >
                          {open[order.id!] ? (
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
                      <TableCell align="right">
                        <Select
                          value={order.status}
                          label="Status"
                          sx={{
                            fontSize: "0.875rem",
                          }}
                          onChange={(event) => {
                            const chosenStatus = event.target.value.replace(
                              " ",
                              "_"
                            ) as OrderStatusEnum;
                            orderApi
                              .updateOrder(order.id!, {
                                ...order,
                                status: chosenStatus,
                              })
                              .then(() => {
                                setChosenOrdersStatus(chosenStatus);
                                setReloadOrders((prev) => !prev);
                                setOpen((prev) => {
                                  const newOpenState = Object.keys(prev).reduce(
                                    (acc, key) => {
                                      acc[Number(key)] = false;
                                      return acc;
                                    },
                                    {} as Record<number, boolean>
                                  );
                                  newOpenState[order.id!] = true;
                                  return newOpenState;
                                });
                              })
                              .catch((error) => {
                                toast.error(
                                  "Nie udało się zaktualizować statusu zamówienia"
                                );
                                console.error(error);
                              });
                          }}
                        >
                          {Object.values(OrderStatusEnum).map((status) => (
                            <MenuItem
                              value={status}
                              key={status}
                              sx={{
                                fontSize: "0.875rem",
                              }}
                            >
                              {status.replaceAll("_", " ")}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={open[order.id!]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Szczegóły zamówienia
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Typ: {order.type.replaceAll("_", " ")}
                            </Typography>
                            {order.type === OrderTypeEnum.Dostawa && (
                              <Typography variant="body1" gutterBottom>
                                Adres dostawy: {order.deliveryAddress}
                              </Typography>
                            )}

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
                                            ?.filter(
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
                                    {order.type === OrderTypeEnum.Dostawa
                                      ? (
                                          order.orderPrice! +
                                          order.deliveryPrice!
                                        ).toFixed(2)
                                      : order.orderPrice!.toFixed(2)}
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
