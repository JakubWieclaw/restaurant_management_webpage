Run project in classic way:

1. Install Node.js 22

2. Install yarn

3. Install vite via yarn

4. `yarn`

5. `yarn dev` - it should run at 5173 port

Run project via Docker image:

(Remember do not run docker commands via `sudo` [solution for permission error](https://stackoverflow.com/questions/48957195/how-to-fix-docker-got-permission-denied-issue))

Terminal way:

1. docker pull bartox7777/restaurant-management-system

2. docker run -p 5173:80 bartox7777/restaurant-management-system

GUI way: Docker desktop - just remember to set 5173 port
![image](https://github.com/user-attachments/assets/f055f9be-42c2-429d-86f4-00de4dcb35c4)



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
