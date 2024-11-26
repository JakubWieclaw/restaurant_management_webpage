#!/bin/bash

# INSERT USER
curl -X 'POST' \
  'http://localhost:8080/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": 0,
  "name": "Jan",
  "surname": "Kowalski",
  "admin": "true",
  "email": "example@example.com",
  "phone": "123123123",
  "password": "example1"
}'

echo

# INSERT 2 USER
curl -X 'POST' \
  'http://localhost:8080/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": 0,
  "name": "Piotr",
  "surname": "Nowak",
  "email": "example1@example.com",
  "phone": "123123123",
  "password": "example1"
}'

echo

# LOGIN TO GET ADMIN TOKEN
admin_resp=$(curl -X 'POST' \
  'http://localhost:8080/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "example@example.com",
  "password": "example1"
}')

admin_token=$(echo "$admin_resp" | jq -r '.token')

# Verify that the token was retrieved successfully
if [ -z "$admin_token" ] || [ "$admin_token" == "null" ]; then
  echo "Error: Failed to retrieve admin token"
  echo "Response from server: $admin_resp"
  exit 1
fi

echo "Admin token retrieved: $admin_token"

# INITIALIZE CONFIG
resp=$(curl -s -X 'POST' \
  'http://localhost:8080/admin/api/config/initialize-system' \
  -H "Authorization: Bearer $admin_token" \
  -H 'Content-Type: application/json' \
  -d '{
    "restaurantName": "Bellissimo",
    "postalCode": "00-000",
    "city": "Warszawa",
    "street": "ul. Marszałkowska 1",
    "phoneNumber": "123456789",
    "email": "a@a",
    "logoUrl": "icons8-meal.png",
    "openingHours": [
      {
        "day": "MONDAY",
        "openingTime": "10:00",
        "closingTime": "22:00"
      },
      {
        "day": "TUESDAY",
        "openingTime": "11:00",
        "closingTime": "23:59"
      },
      {
        "day": "WEDNESDAY",
        "openingTime": "12:00",
        "closingTime": "22:00"
      },
      {
        "day": "THURSDAY",
        "openingTime": "13:00",
        "closingTime": "22:00"
      },
      {
        "day": "FRIDAY",
        "openingTime": "14:00",
        "closingTime": "22:00"
      },
      {
        "day": "SATURDAY",
        "openingTime": "15:00",
        "closingTime": "22:00"
      },
      {
        "day": "SUNDAY",
        "openingTime": "16:00",
        "closingTime": "22:00"
      }
    ],
    "deliveryPricings": [
      {
        "maximumRange": 1,
        "price": 5.99
      },
      {
        "maximumRange": 5,
        "price": 6.99
      },
      {
        "maximumRange": 10,
        "price": 7.99
      }
    ]
}')

# Display the response
echo "Initialization response: $resp"

# Check if initialization was successful
success=$(echo "$resp" | jq -r '.success')
echo "Response from server: $resp"

echo "Initialization finished"

# DELETE ALL DATA
meals=$(curl -s -X 'GET' 'http://localhost:8080/api/meals/all' \
  -H 'Authorization: Bearer '"$admin_token")

meal_ids=$(echo $meals | jq -r '.[].id')

for id in $meal_ids; do
  curl -X 'DELETE' "http://localhost:8080/api/meals/delete/$id" \
    -H 'Authorization: Bearer '"$admin_token"
  echo
done

categories=$(curl -s -X 'GET' 'http://localhost:8080/api/categories/all' \
  -H 'Authorization: Bearer '"$admin_token")

category_ids=$(echo $categories | jq -r '.[].id')

for id in $category_ids; do
  curl -X 'DELETE' "http://localhost:8080/api/categories/delete/$id" \
    -H 'Authorization: Bearer '"$admin_token"
  echo
done

curl -X 'DELETE' \
  'http://localhost:8080/admin/api/config' \
  -H 'Authorization: Bearer '"$admin_token"

echo

# INSERT IMAGE
curl -X 'POST' \
  'http://localhost:8080/api/photos/upload' \
  -H 'Authorization: Bearer '"$admin_token" \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@icons8-meal.png;type=image/jpeg'

echo



# INSERT CATEGORIES
categories=(
  '["Pizza", "icons8-pizza.png"]'
  '["Spaghetti", "icons8-spaghetti.png"]'
  '["Sałatki", "icons8-salad.png"]'
  '["Burgery", "icons8-burger.png"]'
  '["Desery", "icons8-dessert.png"]'
  '["Napoje", "icons8-coffee-cup.png"]'
  '["Sushi", "icons8-sushi.png"]'
  '["Zupy", "icons8-noodles.png"]'
  '["Kanapki", "icons8-sandwich.png"]'
)

first_category_id=""
second_category_id=""

for category in "${categories[@]}"; do
  name=$(echo $category | cut -d',' -f1 | tr -d '[]\" ')
  photographUrl=$(echo $category | cut -d',' -f2 | tr -d '[]\" ')

  curl -X 'POST' \
    'http://localhost:8080/api/photos/upload' \
    -H 'Authorization: Bearer '"$admin_token" \
    -H 'Content-Type: multipart/form-data' \
    -F "file=@$photographUrl;type=image/jpeg"

  echo

  response=$(curl -s -X 'POST' \
    'http://localhost:8080/api/categories/add' \
    -H 'Authorization: Bearer '"$admin_token" \
    -H 'Content-Type: application/json' \
    -d "{
    \"name\": \"$name\",
    \"photographUrl\": \"$photographUrl\"
  }")

  if [ -z "$first_category_id" ]; then
    first_category_id=$(echo $response | jq -r '.id')
  elif [ -z "$second_category_id" ]; then
    second_category_id=$(echo $response | jq -r '.id')
  fi
done

# INSERT PIZZA DISHES
dishes=(
  '{"name": "Pepperoni", "price": 23.99, "ingredients": ["Sos pomidorowy", "Ser", "Pepperoni"], "image": "pizza4.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Diavola", "price": 27.99, "ingredients": ["Sos pomidorowy", "Ser", "Salami", "Oliwki"], "image": "pizza5.jpg", "allergens": ["Nabiał", "Orzechy"]}'
  '{"name": "Vegetariana", "price": 22.99, "ingredients": ["Sos pomidorowy", "Ser", "Papryka", "Pieczarki", "Oliwki"], "image": "pizza6.jpg", "allergens": ["Nabiał", "Soja"]}'
  '{"name": "Prosciutto", "price": 26.99, "ingredients": ["Sos pomidorowy", "Ser", "Szynka", "Rukola"], "image": "pizza7.jpg", "allergens": ["Nabiał", "Gluten", "Jajka"]}'
  '{"name": "Margherita", "price": 20.99, "ingredients": ["Sos pomidorowy", "Ser", "Bazylia"], "image": "pizza1.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Capriciosa", "price": 25.99, "ingredients": ["Sos pomidorowy", "Ser", "Szynka", "Pieczarki"], "image": "pizza2.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Hawajska", "price": 24.99, "ingredients": ["Sos pomidorowy", "Ser", "Szynka", "Ananas"], "image": "pizza3.jpg", "allergens": ["Nabiał", "Gluten"]}'
)

for dish in "${dishes[@]}"; do
  name=$(echo $dish | jq -r '.name')
  price=$(echo $dish | jq -r '.price')
  ingredients=$(echo $dish | jq -r '.ingredients | @json')
  image=$(echo $dish | jq -r '.image')
  allergens=$(echo $dish | jq -r '.allergens | @json')

  weightOrVolume=$((RANDOM % 500 + 100))
  calories=$((RANDOM % 1000 + 500))

  curl -X 'POST' \
    'http://localhost:8080/api/photos/upload' \
    -H 'Authorization: Bearer '"$admin_token" \
    -H 'Content-Type: multipart/form-data' \
    -F "file=@$image;type=image/jpeg"

  echo

  curl -X 'POST' \
    'http://localhost:8080/api/meals/add' \
    -H 'Authorization: Bearer '"$admin_token" \
    -H 'Content-Type: application/json' \
    -d "{
    \"name\": \"$name\",
    \"price\": $price,
    \"photographUrl\": \"$image\",
    \"ingredients\": $ingredients,
    \"weightOrVolume\": $weightOrVolume,
    \"unitType\": \"GRAMY\",
    \"categoryId\": $first_category_id,
    \"allergens\": $allergens,
    \"calories\": $calories
  }"
  echo
done

# INSERT SPAGHETTI DISHES
dishes=(
  '{"name": "Carbonara", "price": 24.99, "ingredients": ["Makaron", "Boczek", "Żółtko", "Ser"], "image": "spaghetti1.jpg", "allergens": ["Nabiał", "Gluten", "Jajka"]}'
  '{"name": "Bolognese", "price": 26.99, "ingredients": ["Makaron", "Mięso mielone", "Sos pomidorowy"], "image": "spaghetti2.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Frutti di Mare", "price": 28.99, "ingredients": ["Makaron", "Owoce morza", "Sos pomidorowy"], "image": "spaghetti3.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Aglio e Olio", "price": 22.99, "ingredients": ["Makaron", "Czosnek", "Oliwa"], "image": "spaghetti4.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Pesto", "price": 25.99, "ingredients": ["Makaron", "Pesto", "Orzechy", "Ser"], "image": "spaghetti5.jpg", "allergens": ["Nabiał", "Orzechy", "Gluten"]}'
  '{"name": "Arrabiata", "price": 23.99, "ingredients": ["Makaron", "Sos pomidorowy", "Papryczki chili"], "image": "spaghetti6.jpg", "allergens": ["Nabiał", "Gluten"]}'
  '{"name": "Alfredo", "price": 27.99, "ingredients": ["Makaron", "Śmietana", "Ser"], "image": "spaghetti7.jpg", "allergens": ["Nabiał", "Gluten"]}'
)

for dish in "${dishes[@]}"; do
  name=$(echo $dish | jq -r '.name')
  price=$(echo $dish | jq -r '.price')
  ingredients=$(echo $dish | jq -r '.ingredients | @json')
  image=$(echo $dish | jq -r '.image')
  allergens=$(echo $dish | jq -r '.allergens | @json')

  weightOrVolume=$((RANDOM % 500 + 100))
  calories=$((RANDOM % 1000 + 500))

  curl -X 'POST' \
    'http://localhost:8080/api/photos/upload' \
    -H 'Authorization: Bearer '"$admin_token" \
    -H 'Content-Type: multipart/form-data' \
    -F "file=@$image;type=image/jpeg"

  echo

  curl -X 'POST' \
    'http://localhost:8080/api/meals/add' \
    -H 'Authorization: Bearer '"$admin_token" \
    -H 'Content-Type: application/json' \
    -d "{
    \"name\": \"$name\",
    \"price\": $price,
    \"photographUrl\": \"$image\",
    \"ingredients\": $ingredients,
    \"weightOrVolume\": $weightOrVolume,
    \"unitType\": \"GRAMY\",
    \"categoryId\": $second_category_id,
    \"allergens\": $allergens,
    \"calories\": $calories
  }"
  echo
done