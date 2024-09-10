import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  TextField,
  Box,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

import { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { toast, Slide } from "react-toastify";

import { Category, CategoryAddCommand } from "../../api";
import { Transition } from "../../utils/Transision";
import { categoriesApi, photoApi, photoDownloadUrl } from "../../utils/api";

interface CategoryModalProps {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  category: Category | null;
  setCategory: (arg0: Category | null) => void;
  setRerenderOnChange: any;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  setOpen,
  category,
  setCategory,
  setRerenderOnChange,
}) => {
  useEffect(() => {
    setCategoryCopy(category);
  }, [category]);

  const [categoryCopy, setCategoryCopy] = useState<Category | null>(category);
  const [photo, setPhoto] = useState<File | null>(null);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-title">
        {category ? "Kategoria: " + category.name : "Nowa kategoria"}
      </DialogTitle>
      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          if (!categoryCopy?.photographUrl || !photo) {
            toast.error("Ikonka jest wymagana.", {
              position: "bottom-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Slide,
            });
            return;
          }
          if (categoryCopy?.id) {
            // update category
            photoApi
              .uploadPhoto(photo)
              .then((response: AxiosResponse) => {
                if (response.status === 200) {
                  categoryCopy.photographUrl = photoDownloadUrl + response.data;
                  categoriesApi
                    .updateCategory(categoryCopy.id!, categoryCopy)
                    .then((response: AxiosResponse) => {
                      if (response.status === 200) {
                        toast.success("Kategoria zaktualizowana pomyślnie.", {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                          transition: Slide,
                        });
                        setOpen(false);
                        setCategory(categoryCopy);
                        setRerenderOnChange((prev: boolean) => !prev);
                      }
                    })
                    .catch((error) => {
                      toast.error(error.response.data, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      });
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                toast.error(error.response.data, {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Slide,
                });
              });
          } else if (category === null) {
            // add category
            const newCategory: CategoryAddCommand = {
              name: categoryCopy?.name ?? "",
              photographUrl: categoryCopy?.photographUrl
                ? photoDownloadUrl + categoryCopy.photographUrl
                : "",
            };
            photoApi
              .uploadPhoto(photo)
              .then((response: AxiosResponse) => {
                if (response.status === 200) {
                  newCategory.photographUrl = photoDownloadUrl + response.data;
                  categoriesApi
                    .addCategory(newCategory)
                    .then((response: AxiosResponse) => {
                      if (response.status === 200) {
                        toast.success("Kategoria dodana pomyślnie.", {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                          transition: Slide,
                        });
                        setOpen(false);
                        setCategory(categoryCopy);
                        setRerenderOnChange((prev: boolean) => !prev);
                      }
                    })
                    .catch((error) => {
                      toast.error(error.response.data.name, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Slide,
                      });
                    });
                }
              })
              .catch((error) => {
                toast.error(error.response.data, {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  transition: Slide,
                });
              });
          } else {
            toast.info(
              "Nie udało się zaktualizować kategorii. Spróbuj ponownie.",
              {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
              }
            );
          }
        }}
      >
        <DialogContent id="alert-dialog-description">
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              alignItems: "center",
            }}
          >
            <TextField
              margin="normal"
              autoFocus
              label="Nazwa kategorii"
              fullWidth
              required
              value={categoryCopy?.name ?? " "}
              onChange={(e) => {
                setCategoryCopy({ ...categoryCopy, name: e.target.value });
              }}
            />
            <input
              accept="image/*"
              id="file-upload"
              type="file"
              hidden
              onChange={(e) => {
                if (e.target.files) {
                  setPhoto(e.target.files[0]);
                  setCategoryCopy({
                    ...categoryCopy,
                    photographUrl: e.target.files[0].name,
                    name: categoryCopy?.name ?? "",
                  });
                }
              }}
            />
            <label htmlFor="file-upload">
              <Button
                startIcon={<ImageIcon />}
                variant="contained"
                component="span"
                sx={{ mt: 2, py: 1 }}
              >
                Ikonka *
              </Button>
              <br />
            </label>
            <Typography
              variant="caption"
              color={categoryCopy?.photographUrl ? "GrayText" : "Red"}
            >
              (
              {categoryCopy?.photographUrl
                ? categoryCopy?.photographUrl
                : "Nie wybrano - wymagane"}
              )
            </Typography>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            autoFocus
          >
            Anuluj
          </Button>

          {category ? (
            <>
              <Button
                onClick={() => {
                  if (categoryCopy?.id) {
                    categoriesApi
                      .deleteCategoryById(categoryCopy.id)
                      .then((e) => {
                        setOpen(false);
                        setCategory(null);
                        toast.success(e.data, {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                          transition: Slide,
                        });
                        setRerenderOnChange((prev: boolean) => !prev);
                      })
                      .catch((error) => {
                        toast.error(error.response.data, {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                          transition: Slide,
                        });
                      });
                  }
                }}
                color="error"
              >
                Usuń
              </Button>
              <Button color="warning" type="submit">
                Edytuj
              </Button>
            </>
          ) : (
            <Button color="success" type="submit">
              Dodaj
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};
