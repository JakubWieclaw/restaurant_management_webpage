import {
  FreeMode,
  Pagination,
  Navigation,
  Autoplay,
  Mousewheel,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Box, Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useEffect } from "react";

import { categoriesApi } from "../../../utils/api";
import { CategoryCard } from "./CategoryCard";
import { AxiosResponse } from "axios";
import { Category } from "../../../api";

interface CategorySelectorProps {
  setCategory: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  setCategory,
}) => {
  const [categories, setCategories] = useState<[string, string][]>([]);

  useEffect(() => {
    categoriesApi.getAllCategories().then((data: AxiosResponse) => {
      setCategories(
        data.data.map((category: Category) => [
          category.name,
          category.photographUrl,
        ])
      );
    });
  }, []);

  return (
    <Box>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        loop={false}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay, FreeMode, Mousewheel]}
        centeredSlides={true}
        mousewheel={true}
        className="mySwiper"
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 50,
          },
        }}
        freeMode={true}
      >
        {categories.length === 0 &&
          Array(6)
            .fill(null)
            .map((_, index) => (
              <SwiperSlide key={index}>
                <Skeleton
                  height={200}
                  width={110}
                  sx={{
                    my: 5,
                    mx: 1,
                  }}
                />
              </SwiperSlide>
            ))}
        {categories.map(([category, icon]) => (
          <SwiperSlide
            key={category}
            onClick={() => {
              setCategory(category);
            }}
          >
            <CategoryCard category={category} icon={icon} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
