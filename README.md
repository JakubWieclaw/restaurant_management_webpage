### Running the Project

### Classic Method

1. **Install Node.js 22**
2. **Install Yarn**
3. **Install Vite via Yarn**
4. Run the following command to install dependencies:
   ```bash
   yarn
   ```
5. Start the development server:
   ```bash
   yarn dev
   ```
   The project should be accessible at [http://localhost:5173](http://localhost:5173).

### Backend Setup

1. Navigate to the `restaurant_management_backend` repository.
2. Run the server using the provided script:
   ```bash
   ./doNotUse.sh
   ```

### API Interface Update

1. On the frontend site, update the API interface by running the following script:
   ```bash
   ./updateApi.sh
   ```

### Inserting Test Data

1. Insert test data into the database by running the following script:
   ```bash
   cd public; ./insertTestData.sh
   ```

### Docker Method

> **Note:** Do not run Docker commands using `sudo`. If you encounter a permission error, [refer to this solution](https://stackoverflow.com/questions/48957195/how-to-fix-docker-got-permission-denied-issue).

#### Terminal

1. Pull the Docker image:
   ```bash
   docker pull bartox7777/restaurant-management-system
   ```
2. Run the Docker container:
   ```bash
   docker run -p 5173:80 bartox7777/restaurant-management-system
   ```

#### GUI (Docker Desktop)

- Use Docker Desktop to run the container.
- Make sure to set the port to `5173`.

![Docker Desktop Example](https://github.com/user-attachments/assets/f055f9be-42c2-429d-86f4-00de4dcb35c4)




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
