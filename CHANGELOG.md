## 1.1.1 (2023-11-17)
* fix: css imports paths

## 1.1.0 (2023-11-17)
* feat: upgrade to vite ^5
* feat: deps update
* fix: warning message with optimizeDeps

## 1.0.1 (2023-11-14)
* fix: #27 normalizePath on windows

## 1.0.0 (2023-06-27)
* feat: stable 1.0 release, vite ^4.3.9
* read more about changes and how to upgrade from 0.0.x [here](https://vituum.dev/guide/migrating-1-0.html)

## 0.0.42 (2023-04-14)
* feat: deps update, vite ^4.2.1

## 0.0.41 (2023-02-28)
* feat: deps update, vite ^4.1.4
 
## 0.0.40 (2023-02-28)
* feat: update emails paths, emails should be now in src/views and paths should be configured via @vituum/juice

## 0.0.39 (2023-01-31)
* fix: regression from 0.0.38 with paths on Linux/Mac

## 0.0.38 (2022-12-15)
* fix: file paths problems on Windows (FastGlob related)

## 0.0.37 (2022-12-10)
* fix: imports chokidar not working

## 0.0.36 (2022-12-10)
* feat: deps update, vite ^4.0.0
* fix: deprecated polyfillModulePreload replaced with modulePreload

## 0.0.34 / 0.0.35 (2022-11-14)
* feat: deps update, vite ^3.2.3

## 0.0.33 (2022-11-14)
* fix: import file paths files didn't update upon change, HMR changed to chokidar watcher

## 0.0.32 (2022-09-07)
* fix: relative paths for root and output options were not supported
* fix: moving files from views dir in build was hardcoded, now respects output dir and views dir option

## 0.0.31 (2022-09-02)
* fix: not working sub-dirs in imports

## 0.0.30 (2022-09-02)
* fix: middleware json format

## 0.0.29 (2022-08-31)
* feat: improved @vituum/vite-plugin-imports internal plugin to support multiple directories

## 0.0.28 (2022-08-30)
* initial public release
