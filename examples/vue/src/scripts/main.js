import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from '../templates/App.vue'
import HelloWorld from '../templates/Components/HelloWorld.vue'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
    { path: '/', component: HelloWorld, props: {msg:'Vite + Vue + Vue Router'} },
    { path: '/about', component: HelloWorld, props: {msg:'Vituum + Vue + Vue Router'} },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})

// 5. Create and mount the root instance.
const app = createApp(App)
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)

app.mount('#app')

// Now the app has started!
