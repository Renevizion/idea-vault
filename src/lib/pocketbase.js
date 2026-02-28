import PocketBase from 'pocketbase';

// Initialize PocketBase with your backend URL
// Replace 'YOUR_POCKETBASE_URL' with the actual URL of your PocketBase instance
// For example: 'http://127.0.0.1:8090'
export const pb = new PocketBase('http://127.0.0.1:8090');

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
