import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pocketbasedb-production.up.railway.app');

// Optional: Set a custom store for authStore to persist user sessions
// For example, using localStorage (default is also localStorage but this makes it explicit)
// pb.authStore.onChange((token, model) => {
//   console.log('authStore changed', token, model);
//   // You can perform additional actions here if needed
// });

// Example utility function (can be expanded as needed)
export const getFileUrl = (record, filename) => {
  if (!record || !filename) {
    return '';
  }
  return pb.files.getUrl(record, filename);
};
