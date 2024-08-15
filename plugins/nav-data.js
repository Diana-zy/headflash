// plugins/navData.js
export default async function ({ $axios, env, isServer }, inject) {
  // if (!isServer) return;

  try {
    const data = await $axios.$get("/api/article/get_all_category", {
      params: {
        site_id: env.SITE_ID
      }
    });
    inject("navData", data);
  } catch (error) {
    console.error("Failed to fetch navigation data:", error);
    inject("navData", []);
  }
}
