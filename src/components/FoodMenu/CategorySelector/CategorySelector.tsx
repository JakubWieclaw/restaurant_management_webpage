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

import api from "../../../utils/api";
import { CategoryCard } from "./CategoryCard";

interface CategorySelectorProps {
  setCategory: (category: string) => void;
}

const fetchCategories = async () => {
  const response = await api.get("/api/categories/all");
  if (response.status === 200) {
    return response.data;
  } else {
    console.error(response);
    return [];
  }
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  setCategory,
}) => {
  const [categories, setCategories] = useState<[string, string][]>([]);

  useEffect(() => {
    fetchCategories().then((data: { id: number; name: string }[]) => {
      const categories_imgs = [
        "icons8-pizza.svg",
        "icons8-spaghetti.svg",
        "icons8-salad.svg",
        "icons8-burger.svg",
        "icons8-dessert.svg",
        "icons8-coffee-cup.svg",
        "icons8-sushi.svg",
        "icons8-noodles.svg",
        "icons8-sandwich.svg",
      ];

      setCategories(
        data
          .toReversed()
          .map((json, index: number) => [json.name, categories_imgs[index]])
      );
    });
  }, []);

  // let categories: [string, string][] = [
  //   ["Pizza", "icons8-pizza.svg"],
  //   ["Spaghetti", "icons8-spaghetti.svg"],
  //   ["Sałatki", "icons8-salad.svg"],
  //   ["Burgery", "icons8-burger.svg"],
  //   ["Desery", "icons8-dessert.svg"],
  //   ["Napoje", "icons8-coffee-cup.svg"],
  //   ["Sushi", "icons8-sushi.svg"],
  //   ["Zupy", "icons8-noodles.svg"],
  //   ["Kanapki", "icons8-sandwich.svg"],
  // ];

  return (
    <Box>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        loop={false}
        pagination={{
          clickable: true,
        }}
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
