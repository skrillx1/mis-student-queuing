// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@sidebase/nuxt-auth", "nuxt-charts"],
  tailwindcss: {
    cssPath: "~/assets/css/design-system.css",
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  auth: {
    provider: {
      type: "local",
      token: {
        maxAgeInSeconds: 60 * 60 * 24,
      },
      endpoints: {
        signIn: { path: "/login", method: "post" },
        signOut: { path: "/logout", method: "post" },
        getSession: { path: "/user", method: "get" },
      },
      pages: {
        login: "/login",
      },
    },
  },
});
