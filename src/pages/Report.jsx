import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentInfo, worksheetData, aiReport } = location.state || {};

  useEffect(() => {
    if (!studentInfo || !worksheetData) {
      navigate('/');
    }
  }, [studentInfo, worksheetData, navigate]);

  if (!studentInfo) return null;

  // AI 데이터 기반 다각 그래프 데이터
  const statsData = aiReport?.stats ? [
    aiReport.stats.planning || 80,
    aiReport.stats.creativity || 80,
    aiReport.stats.relationship || 80,
    aiReport.stats.execution || 80,
    aiReport.stats.resilience || 80,
    aiReport.stats.analysis || 80
  ] : [85, 90, 70, 80, 75, 88];

  const data = {
    labels: ['계획성', '창의성', '관계지향', '실행력', '회복탄력성', '분석력'],
    datasets: [
      {
        label: '나의 부캐 능력치',
        data: statsData,
        backgroundColor: 'rgba(139, 92, 246, 0.4)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(139, 92, 246, 1)',
        pointHoverBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        pointLabels: { color: '#f8fafc', font: { size: 14, family: 'Inter' } },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#f8fafc', font: { family: 'Inter' } }
      }
    }
  };

  return (
    <div className="page-layout fade-in">
      <div className="glass-container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>부캐 리포트</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {studentInfo.school} {studentInfo.major} {studentInfo.studentId} {studentInfo.name}님
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          {/* 차트 영역 */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Radar data={data} options={options} />
            </div>
          </div>

          {/* AI 분석 요약 영역 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)', flex: 1 }}>
              <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>🔑 AI 분석 키워드</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {worksheetData.keywords.map((kw, i) => (
                  <span key={i} style={{ background: 'var(--accent-color)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)', flex: 2 }}>
              <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>✨ 부캐릭터 페르소나</h3>
              {aiReport ? (
                <>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginBottom: '16px' }}>[{aiReport.personaTitle}]</h4>
                  <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                    {aiReport.description}
                  </div>
                </>
              ) : (
                <p style={{ lineHeight: 1.8, color: 'var(--danger-color)' }}>
                  AI 분석 데이터를 불러오는 데 실패했습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>🚀 실행 및 Plan B 전략 (제출 내역)</h3>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent-color)' }}>방향:</strong> {worksheetData.planDirection}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent-color)' }}>실행 전략:</strong> {worksheetData.planStrategy}
          </div>
          <div>
            <strong style={{ color: 'var(--accent-color)' }}>Plan B:</strong> {worksheetData.planB}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="btn" onClick={() => navigate('/')}>
            처음으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
