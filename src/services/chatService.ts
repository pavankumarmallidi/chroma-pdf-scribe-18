
/**
 * Service for handling chat messages to webhook
 */
export const sendChatMessage = async (
  message: string,
  userEmail: string
): Promise<any> => {
  const webhookUrl = "http://localhost:5678/webhook-test/5221a79c-7222-4245-98ec-01d6b56d20c7";
  
  const payload = {
    message: message,
    userEmail: userEmail
  };

  console.log('Sending chat message:', payload);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const responseData = await response.json();
    console.log('Chat webhook response:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Chat message failed:', error);
    throw error;
  }
};
