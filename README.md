<p align="center">
  <a href="https://vituum.dev/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://core.newlogic.cz/logo.png" alt="Logo">
  </a>
</p>
<p align="center">
  <a href="https://npmjs.com/package/vituum"><img src="https://img.shields.io/npm/v/vituum.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vituum.svg" alt="node compatility"></a>
</p>

# ⚡⚙️ Vituum

> Still in very early development.
> For now it works only with `"type": "module"`

Fast prototyping with template engines and integrated frontend tools

- ⚡ Vite integrated
- 🚀️ Fast prototyping
- 🛠️ Integrated tools
- 💡 Template engines
- 📦 Modular structure
- ✉️ Email templates

Vituum is a wrapper around **Vite** which includes predefined config and set of plugins.<br>
It's a mix of words **Vite** _(French word for "quick")_ and **Tuum** _(Estonion word for "core")_.<br>

* A primary focus is on backend integration, but can be used for anything.
* A modified build command `vituum build` is used, which supports building of template engine files

## 🛠️ Integrated tools and plugins
* **[Vite](https://vitejs.dev/)** blazing fast and next generation frontend tooling
* **[PostCSS](https://postcss.org/)** with core plugins (postcss-import, postcss-nesting, custom-media, custom-selectors)
* **[PostHTML](https://posthtml.org/)** with core plugins (include, extend, expressions)
* **[Tailwind CSS](https://tailwindcss.com/)** - utility-first CSS framework packed with classes *(optional)*
* **[Juice](https://github.com/Automattic/juice)** inlining styles for email templates
* **[Nodemailer](https://nodemailer.com)** easy send test your email templates with `vituum send` command
* **[@vituum/vite-plugin-imports](https://github.com/vituum/vituum/blob/main/plugins/imports.js)** - auto generates import files for styles and scripts
* **[@vituum/vite-plugin-middleware](https://github.com/vituum/vituum/blob/main/plugins/imports.js)** - use urls without `.html` extname in Vite server

## 💡 Template engines
* **[Latte](https://latte.nette.org/)** ([vite-plugin-latte](https://github.com/lubomirblazekcz/vite-plugin-latte)) - template engine mainly used with PHP framework [Nette](https://nette.org/)
* **[Twig](https://twig.symfony.com/)** ([vite-plugin-twig](https://github.com/fiadone/vite-plugin-twig)) - template engine mainly used with PHP framework [Symfony](https://symfony.com/)
* More planned - [hbs](https://handlebarsjs.com/), [njk](https://mozilla.github.io/nunjucks/), [liquid](https://liquidjs.com/), [pug](https://pugjs.org/)

## 📦 Modular structure

* **src**
  * **assets** - your static files as `.png`, `.svg`
  * **data** - your `.json` data used in templates
  * **emails** - your email templates
  * **scripts** - your script files as `.js`, `.ts`
  * **styles** - your styles files as `.css`, `.scss`
  * **templates** - your template files as `.twig`, `.latte`
  * **views** - your pages as `.html`, you can also nest and define page as `.json` or `.twig`, `.latte`

## 🪄 Instalation

```sh
npm i vituum --save-dev
```

### Config

Each Vituum project needs to have config via `vite.config.js`<br>
Read the [Docs](https://vitejs.dev/config/) to learn more about configuration

```js
import { defineConfig } from 'vituum'

export default defineConfig({
  // optional vituum config here
})
```

You can also try [minimal example project here](https://github.com/vituum/example)

### Requirements

- [Node.js LTS (14.x)](https://nodejs.org/en/download/)

## Licence
MIT
