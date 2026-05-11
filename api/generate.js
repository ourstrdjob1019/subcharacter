import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API Key on server' });
  }

  const { studentInfo, worksheetData } = req.body;
  if (!studentInfo || !worksheetData) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
당신은 사용자의 성향, 가치관, 감정 반응, 관계 유형, 루틴, 진로 방향을 분석하여 현실적이고 몰입감 있는 ‘3년 뒤 미래 시뮬레이션’을 설계하는 AI 커리어 시뮬레이터입니다.
아래 워크시트 내용을 단순 요약하지 말고, 사용자의 성격·생활패턴·말투·대인관계·선호 환경·진로 방향성을 종합적으로 연결하여 ‘3년 뒤 실제 삶의 장면’을 구체적으로 서술해주세요.

[입력 데이터]
이름: ${studentInfo.name}
전공: ${studentInfo.major}
MBTI: ${worksheetData.mbti}
핵심 키워드: ${worksheetData.keywords.join(', ')}
말투/감정 반응: ${worksheetData.q1_speech} / ${worksheetData.q2_stress}
관계 유형: ${worksheetData.q3_relationship}
혼자 있을 때 행동: ${worksheetData.q4_alone}
좋아하는 공간과 분위기: ${worksheetData.q5_space}
제3자 시점 자기소개: ${worksheetData.thirdPersonDesc}
진로 방향: ${worksheetData.planDirection}
실행 전략: ${worksheetData.planStrategy}

[필수 반영 요소]
1. 3년 뒤 사용자의 직무와 업무 환경 (어떤 공간에서 일하는지, 어떤 사람들과 협업하는지, 조직 분위기)
2. 미래의 하루 루틴 (기상 후 행동, 출근/활동 방식, 일하는 스타일, 쉬는 시간과 인간관계 모습)
3. 현재 성향이 미래의 강점으로 발전한 모습 (예: 예민함 → 관찰력, 계획성 → 프로젝트 관리 능력 등 연결해서 표현)
4. 현재의 고민이 변화한 과정 (불안, 고민 등이 어떤 경험을 통해 변화했는지)
5. 사용자가 이룬 현실적인 성취 (거창한 성공보다 첫 프로젝트 완수 등 실제 가능한 변화 중심)
6. 미래의 사용자가 현재의 나에게 해주는 조언 (진심 어린 인터뷰처럼 작성, 감성적이되 오글거리지 않게)

[작성 방식]
'3년 뒤의 하루 브이로그' 느낌으로 몰입감 있게 작성해주세요. 절대 추상적으로 작성하지 말고 행동, 습관, 대화, 환경 묘사를 구체적으로 포함하세요.

[출력 형식]
위 내용을 바탕으로 반드시 아래 JSON 형식으로만 반환해주세요. 마크다운(\`\`\`json 등)이나 추가 설명 없이 순수 JSON만 반환해야 합니다.
{
  "personaTitle": "3년 뒤 나의 모습 (예: 데이터로 세상을 엮어내는 기획자)",
  "description": "위 필수 반영 요소들이 모두 담긴 몰입감 있는 3년 뒤 브이로그 형태의 텍스트 (줄바꿈은 \\n으로 처리하여 하나의 긴 문자열로 묶어서 반환해주세요. 매우 길어도 좋습니다.)",
  "stats": {
    "planning": 85,
    "creativity": 90,
    "relationship": 75,
    "execution": 80,
    "resilience": 88,
    "analysis": 92
  }
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```(?:json)?/gi, '').trim();
    return res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    console.error('Gemini API 호출 에러 세부정보:', error);
    return res.status(500).json({ error: 'AI 에러 상세: ' + error.message });
  }
}
