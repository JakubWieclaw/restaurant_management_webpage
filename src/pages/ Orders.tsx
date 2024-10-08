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
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

import { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

import { orderApi } from "../utils/api";

export const Orders = () => {
  const [open, setOpen] = useState<boolean[]>([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderApi.getAllOrders().then((response: AxiosResponse) => {
      console.log(response.data);
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
                <TableRow key={order.id}>
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
              ))}
              {/* <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}
                >
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        History
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Total price ($)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">123</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow> */}
            </>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
