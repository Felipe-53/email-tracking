const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  console.error(
    `Base URL not defined. Define 'VITE_BASE_URL' it in .env.production and .env.development`
  );
}

export const env = {
  baseUrl: baseUrl as string,
};
