import { useQuery } from '@tanstack/react-query';

function useImageApiResponse(prompt, enabled) {
  return useQuery({
    queryKey: ['getImageResponse', prompt],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch image data');
      }

      const data = await response.json();

      return data?.answer?.data[0]?.imageURL;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
}

export default useImageApiResponse;
