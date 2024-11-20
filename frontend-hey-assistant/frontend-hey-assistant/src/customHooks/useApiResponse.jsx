import { useQuery } from '@tanstack/react-query';

function useApiResponse(question, enabled) {
  return useQuery({
    queryKey: ['getAnswer', question],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data.answer;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}

export default useApiResponse;
