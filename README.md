<p align="center">
  <a href="https://vituum.dev/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://avatars.githubusercontent.com/u/109584961" alt="Logo">
  </a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/vituum"><img src="https://img.shields.io/npm/v/vituum.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vituum.svg" alt="node compatility"></a>
</p>

# ⚡⚙️ Vituum

> Still in early development.

Fast prototyping with template engines and integrated frontend tools

- ⚡ Vite integrated
- 🚀️ Fast prototyping
- 🛠️ Integrated tools
- 💡 Template engines
- 📦 Modular structure
- ✉️ Email templates

Vituum is a small wrapper around **Vite** which includes predefined config and set of plugins.<br>
It's a mix of words **Vite** _(French word for "quick")_ and **Tuum** _(Estonian word for "core")_.<br>

* Primary focus is on backend integration, but can be used for anything.
* Modified build command `vituum build` is used, which supports building of template engine files with extname such as `.twig` or `.pug`

Learn more about **Vituum** on [Features](https://vituum.dev/guide/features.html) page.

## 🪄 Get started

```sh
mkdir my-project && cd my-project
npm i vituum --save-dev
```

### Config

Each Vituum project needs to have config via `vite.config.js`<br>
Read the [Docs](https://vituum.dev/config/) to learn more about configuration

```js
import { defineConfig } from 'vituum'

export default defineConfig({
  // vituum config here
})
```

You can try Vituum online on [Stackblitz](https://vituum.dev/guide/#trying-vituum-online) or view all examples on [GitHub](https://github.com/vituum/vituum/tree/main/examples)

## 📌 Future plans
- refactoring and rewrite to **TypeScript**
- tests written via **Vitest**

### Requirements

- [Node.js LTS (14.x)](https://nodejs.org/en/download/)

## Licence
MIT
