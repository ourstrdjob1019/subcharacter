import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generatePersonaReport } from '../lib/gemini';

const Worksheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentInfo = location.state?.studentInfo || null;

  const [formData, setFormData] = useState({
    mbti: '',
    keywords: ['', '', '', '', ''],
    q1_speech: '',
    q2_stress: '',
    q3_relationship: '',
    q4_alone: '',
    q5_space: '',
    thirdPersonDesc: '',
    planDirection: '',
    planStrategy: '',
    planB: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // 만약 기본 정보 없이 접근했다면 홈으로 리다이렉트
  React.useEffect(() => {
    if (!studentInfo) {
      navigate('/');
    }
  }, [studentInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData(prev => ({ ...prev, keywords: newKeywords }));
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Gemini AI 호출 (DB 저장 생략)
      const aiReport = await generatePersonaReport(studentInfo, formData);
      
      // 2. 바로 결과 페이지로 이동
      navigate('/report', { state: { studentInfo, worksheetData: formData, aiReport } });
    } catch (err) {
      console.error(err);
      alert('AI 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Gemini AI 호출
      const aiReport = await generatePersonaReport(studentInfo, formData);
      
      // 2. Supabase DB 저장
      const { error } = await supabase.from('students_worksheet').insert([{
        school: studentInfo.school,
        student_id: studentInfo.studentId,
        major: studentInfo.major,
        name: studentInfo.name,
        mbti: formData.mbti,
        keywords: formData.keywords,
        q1_speech: formData.q1_speech,
        q2_stress: formData.q2_stress,
        q3_relationship: formData.q3_relationship,
        q4_alone: formData.q4_alone,
        q5_space: formData.q5_space,
        third_person_desc: formData.thirdPersonDesc,
        plan_direction: formData.planDirection,
        plan_strategy: formData.planStrategy,
        plan_b: formData.planB,
        ai_title: aiReport?.personaTitle || '분석 실패',
        ai_description: aiReport?.description || 'AI 분석 데이터를 가져오지 못했습니다.',
        ai_stats: aiReport?.stats || null
      }]);

      if (error) {
        console.error('Supabase Error:', error);
        alert('데이터 저장 중 문제가 발생했습니다.');
      }

      // 3. 결과 페이지 이동
      navigate('/report', { state: { studentInfo, worksheetData: formData, aiReport } });
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!studentInfo) return null;

  return (
    <div className="page-layout fade-in">
      <div className="glass-container">
        <h1 className="worksheet-title">1단계 워크시트: 진단 기반 자기이해</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          {studentInfo.name}님({studentInfo.major}), 나를 부캐처럼 표현할 수 있도록 아래 질문에 답해보세요.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1 */}
          <div style={{ marginBottom: '40px' }}>
            <h2>① MBTI</h2>
            <div className="input-group">
              <input
                type="text"
                name="mbti"
                className="input-field"
                placeholder="예) ENFP"
                value={formData.mbti}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '40px' }}>
            <h2>② 나를 표현하는 핵심 키워드 5개</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <input
                  key={i}
                  type="text"
                  className="input-field"
                  style={{ flex: '1 1 calc(20% - 10px)', minWidth: '120px' }}
                  placeholder={`키워드 ${i + 1}`}
                  value={formData.keywords[i]}
                  onChange={(e) => handleKeywordChange(i, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '40px' }}>
            <h2>③ 나의 성향 파악</h2>
            <div className="input-group">
              <label className="input-label">1. 나는 어떤 말투나 표현을 자주 쓰나요?</label>
              <textarea name="q1_speech" className="input-field" value={formData.q1_speech} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">2. 나는 어떤 상황에서 스트레스를 느끼고, 어떻게 반응하나요?</label>
              <textarea name="q2_stress" className="input-field" value={formData.q2_stress} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">3. 나는 어떤 사람과 잘 맞고, 어떤 유형과는 어려움을 느끼나요?</label>
              <textarea name="q3_relationship" className="input-field" value={formData.q3_relationship} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">4. 나는 혼자 있을 때 어떤 활동을 주로 하나요?</label>
              <textarea name="q4_alone" className="input-field" value={formData.q4_alone} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label">5. 내가 좋아하는 공간, 분위기, 시간대는 어떤가요?</label>
              <textarea name="q5_space" className="input-field" value={formData.q5_space} onChange={handleChange} required />
            </div>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '40px' }}>
            <h2>④ 제3자 시점으로 나 설명해보기</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>
              나를 제3자의 시선으로 소개하듯 자유롭게 서술해보세요.<br/>
              (예: 이 사람은 차분하고 계획적이며, 말수가 적지만 관찰력이 뛰어나다...)
            </p>
            <textarea name="thirdPersonDesc" className="input-field" style={{ minHeight: '250px' }} value={formData.thirdPersonDesc} onChange={handleChange} required />
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '40px', padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <h2>⑤ 실행 계획 정교화 및 Plan B 수립</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
              이 워크시트는 자신의 진로 실행 전략을 정교화하고, 예상하지 못한 상황에 대비한 Plan B를 수립하기 위한 도구입니다.
            </p>
            
            <div className="input-group">
              <label className="input-label">1. 나의 진로 방향 정리 (시뮬레이션 결과를 바탕으로 내가 원하는 미래의 모습 정리, 진로 유형 및 방향 키워드 도출)</label>
              <textarea name="planDirection" className="input-field" value={formData.planDirection} onChange={handleChange} required />
            </div>
            
            <div className="input-group">
              <label className="input-label">2. 실행전략 정교화 (내가 할 수 있는 실행 활동을 월별/주별로 구체화. 예: 매주 콘텐츠 기획 1편)</label>
              <textarea name="planStrategy" className="input-field" value={formData.planStrategy} onChange={handleChange} required />
            </div>
            
            <div className="input-group">
              <label className="input-label">3. Plan B 수립 (예상대로 되지 않았을 때의 대응 전략. 예: 직무 전환, 대체 활동 연결)</label>
              <textarea name="planB" className="input-field" value={formData.planB} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button type="button" onClick={handleTestSubmit} className="btn" disabled={isLoading} style={{ fontSize: '1.2rem', padding: '16px 48px', backgroundColor: 'var(--surface-color)', border: '2px solid var(--primary-color)' }}>
              {isLoading ? 'AI 분석 중...' : 'AI 결과만 테스트 (DB저장 X)'} 
            </button>
            <button type="submit" className="btn" disabled={isLoading} style={{ fontSize: '1.2rem', padding: '16px 48px' }}>
              {isLoading ? 'AI 분석 중...' : '부캐 리포트 생성하기'} <Send size={24} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Worksheet;
