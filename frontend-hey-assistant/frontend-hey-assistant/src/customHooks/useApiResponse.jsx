import { useMutation } from '@tanstack/react-query';

function useApiResponse() {
  return useMutation({
    mutationFn: async (question) => {
      const response = await fetch('http://localhost:8080/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data.answer;
    },
  });
}

export default useApiResponse;
