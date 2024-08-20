# download json file from http://localhost:8080/v3/api-docs
# and save it to ./api-docs.json

curl -o api-docs.json http://localhost:8080/v3/api-docs

npx @openapitools/openapi-generator-cli generate -i "api-docs.json" -g typescript-axios -o src/api