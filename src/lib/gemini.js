export const generatePersonaReport = async (studentInfo, worksheetData) => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentInfo, worksheetData }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'API 요청 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('API 호출 에러:', error);
    return null;
  }
};
