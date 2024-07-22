import { Box, Grid, Typography, Paper } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation, Autoplay } from "swiper/modules";

import { CategoryPaper } from "./CategoryPaper";

import "swiper/css";
import "swiper/css/pagination";

export function CategorySelector() {
  const categories: [string, string][] = [
    ["Pizza", "icons8-pizza.svg"],
    ["Spaghetti", "icons8-spaghetti.svg"],
    ["Sałatki", "icons8-salad.svg"],
    ["Burgery", "icons8-burger.svg"],
    ["Desery", "icons8-dessert.svg"],
    ["Napoje", "icons8-coffee-cup.svg"],
    ["Sushi", "icons8-sushi.svg"],
    ["Zupy", "icons8-noodles.svg"],
    ["Kanapki", "icons8-sandwich.svg"],
  ];
  return (
    <Box>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay, FreeMode]}
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
        freeMode={false}
      >
        {categories.map(([category, icon]) => (
          <SwiperSlide key={category}>
            <CategoryPaper category={category} icon={icon} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
