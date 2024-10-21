import { Autocomplete, Grid, TextField } from "@mui/material";
import { Container, Divider, Typography } from "@mui/material";

import { useEffect, useState } from "react";

import { customersApi } from "../utils/api";
import { Customer } from "../api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export const AdminPanel = () => {
  useEffect(() => {
    customersApi.getAllCustomers().then((res: AxiosResponse) => {
      setAllCustomers(res.data);
    });
  }, []);

  const [allCustomers, setAllCustomers] = useState([]);

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
                onChange={(e: any) => {
                  console.log(e.target.innerText);
                  navigate(
                    `/customer-details/${e.target.innerText
                      .split(" ")[0]
                      .slice(1, -1)}`
                  );
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
        </Grid>
      </Container>
    </div>
  );
};
