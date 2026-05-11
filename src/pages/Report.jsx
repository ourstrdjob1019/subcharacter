import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
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
  const reportRef = useRef(null);
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

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0f172a', // 리포트 배경색
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${studentInfo.name}_부캐리포트.png`;
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="page-layout fade-in">
      <div className="glass-container" ref={reportRef} style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>부캐 리포트</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {studentInfo.school} {studentInfo.major} {studentInfo.studentId} {studentInfo.name}님
          </p>
        </div>

        {/* 2단: 좌측(차트), 우측(키워드) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <Radar data={data} options={options} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--glass-border)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '24px', textAlign: 'center', backgroundColor: 'transparent', color: '#f8fafc' }}>🔑 AI 분석 키워드</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {worksheetData.keywords.map((kw, i) => (
                  <span key={i} style={{ background: 'var(--accent-color)', padding: '10px 20px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 600 }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3단: 실행 및 Plan B (전체 너비) */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '32px', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '24px', backgroundColor: 'transparent', color: '#f8fafc' }}>🚀 실행 및 Plan B 전략</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>방향:</strong>
              <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{worksheetData.planDirection}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>실행 전략:</strong>
              <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{worksheetData.planStrategy}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>Plan B:</strong>
              <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{worksheetData.planB}</div>
            </div>
          </div>
        </div>

        {/* 4단: 부캐릭터 페르소나 (전체 너비 넓게) */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '32px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '24px', backgroundColor: 'transparent', color: '#f8fafc' }}>✨ 부캐릭터 페르소나</div>
          {aiReport ? (
            <>
              <h4 style={{ fontSize: '1.5rem', color: 'var(--accent-color)', marginBottom: '20px', textAlign: 'center' }}>[{aiReport.personaTitle}]</h4>
              <div style={{ lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {aiReport.description}
              </div>
            </>
          ) : (
            <p style={{ lineHeight: 1.8, color: 'var(--danger-color)', textAlign: 'center' }}>
              AI 분석 데이터를 불러오는 데 실패했습니다.
            </p>
          )}
        </div>
      </div>

      {/* 5단: 버튼들 (이미지 저장 영역 밖) */}
      <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button className="btn" onClick={handleDownloadImage} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
          📸 리포트 이미지로 저장하기
        </button>
        <button className="btn" onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', fontSize: '1.1rem', padding: '16px 32px' }}>
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Report;
