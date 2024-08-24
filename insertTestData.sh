#!/bin/bash

# DELETE ALL DATA
meals=$(curl -s -X 'GET' 'http://localhost:8080/api/meals/all' -H 'accept: */*')

meal_ids=$(echo $meals | jq -r '.[].id')

for id in $meal_ids; do
    curl -X 'DELETE' "http://localhost:8080/api/meals/delete/$id" -H 'accept: */*'
    echo
done

categories=$(curl -s -X 'GET' 'http://localhost:8080/api/categories/all' -H 'accept: */*')

category_ids=$(echo $categories | jq -r '.[].id')

for id in $category_ids; do
    curl -X 'DELETE' "http://localhost:8080/api/categories/delete/$id" -H 'accept: */*'
    echo
done

# INSERT USER
curl -X 'POST' \
    'http://localhost:8080/auth/register' \
    -H 'accept: */*' \
    -H 'Content-Type: application/json' \
    -d '{
  "id": 0,
  "name": "Jan",
  "surname": "Kowalski",
  "email": "a@a",
  "phone": "123123123",
  "password": "asd"
}'

echo

# INSERT CATEGORIES
categories=(
    '["Pizza", "icons8-pizza.svg"]'
    '["Spaghetti", "icons8-spaghetti.svg"]'
    '["Sałatki", "icons8-salad.svg"]'
    '["Burgery", "icons8-burger.svg"]'
    '["Desery", "icons8-dessert.svg"]'
    '["Napoje", "icons8-coffee-cup.svg"]'
    '["Sushi", "icons8-sushi.svg"]'
    '["Zupy", "icons8-noodles.svg"]'
    '["Kanapki", "icons8-sandwich.svg"]'
)

first_category_id=""

for category in "${categories[@]}"; do
    name=$(echo $category | cut -d',' -f1 | tr -d '[]\" ')
    photographUrl=$(echo $category | cut -d',' -f2 | tr -d '[]\" ')

    response=$(curl -s -X 'POST' \
        'http://localhost:8080/api/categories/add' \
        -H 'accept: */*' \
        -H 'Content-Type: application/json' \
        -d "{
    \"name\": \"$name\",
    \"photographUrl\": \"$photographUrl\"
  }")

    if [ -z "$first_category_id" ]; then
        first_category_id=$(echo $response | jq -r '.id')
    fi
done
# INSERT PIZZA DISHES
dishes=(
    '{"name": "Pepperoni", "price": 23.99, "ingredients": ["Sos pomidorowy", "Ser", "Pepperoni"], "image": "food/pizza4.jpg", "allergens": ["Nabiał", "Gluten"]}'
    '{"name": "Diavola", "price": 27.99, "ingredients": ["Sos pomidorowy", "Ser", "Salami", "Oliwki"], "image": "food/pizza5.jpg", "allergens": ["Nabiał", "Orzechy"]}'
    '{"name": "Vegetariana", "price": 22.99, "ingredients": ["Sos pomidorowy", "Ser", "Papryka", "Pieczarki", "Oliwki"], "image": "food/pizza6.jpg", "allergens": ["Nabiał", "Soja"]}'
    '{"name": "Prosciutto", "price": 26.99, "ingredients": ["Sos pomidorowy", "Ser", "Szynka", "Rukola"], "image": "food/pizza7.jpg", "allergens": ["Nabiał", "Gluten", "Jajka"]}'
    '{"name": "Margherita", "price": 20.99, "ingredients": ["Sos pomidorowy", "Ser", "Bazylia"], "image": "food/pizza1.jpg", "allergens": ["Nabiał", "Gluten"]}'
    '{"name": "Capriciosa", "price": 25.99, "ingredients": ["Sos pomidorowy", "Ser", "Szynka", "Pieczarki"], "image": "food/pizza2.jpg", "allergens": ["Nabiał", "Gluten"]}'
    '{"name": "Hawajska", "price": 24.99, "ingredients": ["Sos pomidorowy", "Ser", "Szynka", "Ananas"], "image": "food/pizza3.jpg", "allergens": ["Nabiał", "Gluten"]}'
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
        'http://localhost:8080/api/meals/add' \
        -H 'accept: */*' \
        -H 'Content-Type: application/json' \
        -d "{
    \"name\": \"$name\",
    \"price\": $price,
    \"photographUrl\": \"$image\",
    \"ingredients\": $ingredients,
    \"weightOrVolume\": $weightOrVolume,
    \"unitType\": \"GRAMS\",
    \"categoryId\": $first_category_id,
    \"allergens\": $allergens,
    \"calories\": $calories
  }"
    echo
done
