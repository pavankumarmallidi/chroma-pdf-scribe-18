
/**
 * Service for handling PDF uploads to n8n webhook
 */
export const uploadToWebhook = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('pdf', file);

    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(async response => {
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      onProgress(100);
      resolve();
    })
    .catch(reject);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress <= 95) {
        onProgress(progress);
      } else {
        clearInterval(progressInterval);
      }
    }, 100);
  });
};
