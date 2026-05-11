import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserCircle2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school: '',
    studentId: '',
    major: '',
    name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.school || !formData.studentId || !formData.major || !formData.name) {
      alert('모든 정보를 입력해주세요.');
      return;
    }
    // 다음 단계로 데이터 전달하며 이동
    navigate('/worksheet', { state: { studentInfo: formData } });
  };

  return (
    <div className="page-layout fade-in">
      <div className="glass-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <UserCircle2 size={64} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
          <h1 className="page-title" style={{ marginBottom: '8px', fontSize: '2rem' }}>부캐만들기 프로젝트</h1>
          <p style={{ color: 'var(--text-secondary)' }}>시작하기 전, 기본 정보를 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="school">학교명</label>
            <input
              type="text"
              id="school"
              name="school"
              className="input-field"
              placeholder="예) 한국대학교"
              value={formData.school}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="studentId">학번</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              className="input-field"
              placeholder="예) 20261234"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="major">학과</label>
            <input
              type="text"
              id="major"
              name="major"
              className="input-field"
              placeholder="예) 컴퓨터공학과"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field"
              placeholder="예) 홍길동"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '16px' }}>
            다음 단계로 <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
