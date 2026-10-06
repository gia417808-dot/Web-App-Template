import React, { useState, useMemo } from 'react';
import { initialTasks, TaskItem } from '../mock/deepMockData';

interface TasksAppProps {
  onBack?: () => void;
}

export default function TasksApp({ onBack }: TasksAppProps = {}) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal tạo công việc mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'Khẩn cấp' | 'Cao' | 'Trung bình' | 'Thấp'>('Cao');
  const [newAssignee, setNewAssignee] = useState('Lê Hoàng Nam (Fullstack)');
  const [newDueDate, setNewDueDate] = useState('2026-10-12');
  const [newSubtaskText, setNewSubtaskText] = useState('Thiết kế & hoàn thiện tính năng');

  const columns: { key: TaskItem['status']; title: string; color: string; badgeBg: string }[] = [
    { key: 'backlog', title: 'Chờ xử lý', color: '#64748b', badgeBg: '#f1f5f9' },
    { key: 'doing', title: 'Đang thực hiện', color: '#0284c7', badgeBg: '#e0f2fe' },
    { key: 'review', title: 'Đang nghiệm thu / Test', color: '#d97706', badgeBg: '#fef3c7' },
    { key: 'done', title: 'Hoàn thành', color: '#16a34a', badgeBg: '#dcfce7' },
  ];

  // Lọc nhiệm vụ
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        t.assignee.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchPriority && matchSearch;
    });
  }, [tasks, priorityFilter, searchQuery]);

  // Thống kê tiến độ
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const doing = tasks.filter((t) => t.status === 'doing').length;
    const urgent = tasks.filter((t) => t.priority === 'Khẩn cấp').length;
    const overallProgress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, doing, urgent, overallProgress };
  }, [tasks]);

  // Chuyển trạng thái task
  const moveTask = (taskId: string, targetStatus: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const progress = targetStatus === 'done' ? 100 : targetStatus === 'doing' ? 50 : targetStatus === 'review' ? 85 : 0;
        return { ...t, status: targetStatus, progress_pct: progress };
      })
    );
  };

  // Toggle checklist subtask
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = updatedSubtasks.filter((st) => st.completed).length;
        const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);
        return {
          ...t,
          subtasks: updatedSubtasks,
          progress_pct: newProgress,
          status: newProgress === 100 ? 'done' : t.status === 'backlog' ? 'doing' : t.status,
        };
      })
    );
  };

  // Tạo task mới
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `TASK-${Date.now()}`,
      code: `TSK-${tasks.length + 101}`,
      title: newTitle,
      description: newDesc || 'Nhiệm vụ mới được giao trên hệ thống.',
      status: 'backlog',
      priority: newPriority,
      assignee: newAssignee,
      assignee_avatar: newAssignee.includes('UI/UX') ? '👨‍🎨' : '👨‍💻',
      due_date: newDueDate,
      progress_pct: 0,
      subtasks: newSubtaskText
        ? [
            { id: 'st-new-1', title: newSubtaskText, completed: false },
            { id: 'st-new-2', title: 'Kiểm thử & Báo cáo kết quả', completed: false },
          ]
        : [],
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* HEADER WEBAPP CÔNG VIỆC */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>📋</span>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                Hệ Thống Tiến Độ Công Việc & Dự Án v5.0
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748b' }}>
                Quản lý phân công nhân sự, checklist việc con và luồng Kanban 4 giai đoạn
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Quay lại Sàn Marketplace
            </button>
          )}
          {/* NÚT CHUYỂN CHẾ ĐỘ XEM */}
          <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? '#ffffff' : 'transparent',
                color: viewMode === 'kanban' ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📌 Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📊 Dạng Bảng (Table)
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            }}
          >
            + Giao Việc Mới
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Tổng nhiệm vụ</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{stats.total} việc</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Tiến độ chung: <strong>{stats.overallProgress}%</strong></div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Đang thực hiện</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0284c7' }}>{stats.doing} việc</div>
          <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '4px' }}>Đang chạy theo sprint</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Đã hoàn thành</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>{stats.done} việc</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>✓ Đã bàn giao nghiệm thu</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>Ưu tiên Khẩn cấp</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: stats.urgent > 0 ? '#dc2626' : '#64748b' }}>
            {stats.urgent} việc
          </div>
          <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>Cần xử lý trước trong ngày</div>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC ĐỘ ƯU TIÊN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Ưu tiên:</span>
          {(['ALL', 'Khẩn cấp', 'Cao', 'Trung bình', 'Thấp'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: priorityFilter === p ? '1px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: priorityFilter === p ? '#f0f9ff' : '#ffffff',
                color: priorityFilter === p ? '#0284c7' : '#475569',
                fontSize: '12.5px',
                fontWeight: priorityFilter === p ? '700' : '500',
                cursor: 'pointer',
              }}
            >
              {p === 'ALL' ? 'Tất cả' : p}
            </button>
          ))}
        </div>

        <div>
          <input
            type="text"
            placeholder="🔍 Tìm công việc, nhân sự..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              width: '240px',
            }}
          />
        </div>
      </div>

      {/* CHẾ ĐỘ 1: KANBAN BOARD 4 CỘT */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px', alignItems: 'flex-start' }}>
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  minHeight: '450px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.color }} />
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                      {col.title}
                    </h4>
                  </div>
                  <span
                    style={{
                      backgroundColor: col.badgeBg,
                      color: col.color,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        padding: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{t.code}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor:
                              t.priority === 'Khẩn cấp' ? '#fee2e2' : t.priority === 'Cao' ? '#fef3c7' : '#f1f5f9',
                            color:
                              t.priority === 'Khẩn cấp' ? '#dc2626' : t.priority === 'Cao' ? '#d97706' : '#475569',
                          }}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                        {t.title}
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
                        {t.description}
                      </div>

                      {/* SUBTASK CHECKLIST */}
                      {t.subtasks.length > 0 && (
                        <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '6px', marginBottom: '10px', fontSize: '12px' }}>
                          <div style={{ fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                            Checklist ({t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length}):
                          </div>
                          {t.subtasks.map((st) => (
                            <div
                              key={st.id}
                              onClick={() => toggleSubtask(t.id, st.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '2px 0' }}
                            >
                              <input type="checkbox" checked={st.completed} readOnly style={{ cursor: 'pointer' }} />
                              <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? '#94a3b8' : '#334155' }}>
                                {st.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TIẾN ĐỘ THANH BAR */}
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b', marginBottom: '3px' }}>
                          <span>Tiến độ</span>
                          <strong>{t.progress_pct}%</strong>
                        </div>
                        <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${t.progress_pct}%`,
                              height: '100%',
                              backgroundColor: t.progress_pct === 100 ? '#16a34a' : '#0284c7',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{t.assignee_avatar}</span>
                          <span style={{ color: '#334155', fontWeight: '500' }}>{t.assignee.split(' ')[0]}</span>
                        </div>
                        <div style={{ color: '#94a3b8' }}>📅 {t.due_date}</div>
                      </div>

                      {/* NÚT CHUYỂN NHANH CỘT KANBAN */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                        {col.key !== 'backlog' && (
                          <button
                            onClick={() => moveTask(t.id, col.key === 'done' ? 'review' : col.key === 'review' ? 'doing' : 'backlog')}
                            style={{ flex: 1, padding: '4px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer' }}
                          >
                            ◀ Lùi
                          </button>
                        )}
                        {col.key !== 'done' && (
                          <button
                            onClick={() => moveTask(t.id, col.key === 'backlog' ? 'doing' : col.key === 'doing' ? 'review' : 'done')}
                            style={{ flex: 1, padding: '4px', fontSize: '11px', borderRadius: '4px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Tiếp ▶
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHẾ ĐỘ 2: BẢNG DỮ LIỆU (TABLE VIEW) */}
      {viewMode === 'table' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px' }}>Mã việc</th>
                <th style={{ padding: '12px 16px' }}>Tên công việc</th>
                <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px' }}>Độ ưu tiên</th>
                <th style={{ padding: '12px 16px' }}>Người phụ trách</th>
                <th style={{ padding: '12px 16px' }}>Hạn chót</th>
                <th style={{ padding: '12px 16px' }}>Tiến độ</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0284c7' }}>{t.code}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{t.title}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          t.status === 'done' ? '#dcfce7' : t.status === 'doing' ? '#e0f2fe' : t.status === 'review' ? '#fef3c7' : '#f1f5f9',
                        color:
                          t.status === 'done' ? '#166534' : t.status === 'doing' ? '#0369a1' : t.status === 'review' ? '#92400e' : '#475569',
                      }}
                    >
                      {columns.find((c) => c.key === t.status)?.title}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{t.priority}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {t.assignee_avatar} {t.assignee}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{t.due_date}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: t.progress_pct === 100 ? '#16a34a' : '#0284c7' }}>
                    {t.progress_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL THÊM CÔNG VIỆC MỚI */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                Phân Công Nhiệm Vụ Mới
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Tiêu đề công việc:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên nhiệm vụ cần thực hiện..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Mô tả chi tiết:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú kết quả bàn giao cần đạt..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Độ ưu tiên:
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Khẩn cấp">Khẩn cấp</option>
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Hạn hoàn thành:
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Người phụ trách:
                </label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="Lê Hoàng Nam (Fullstack)">Lê Hoàng Nam (Fullstack)</option>
                  <option value="Đặng Tuấn Anh (UI/UX)">Đặng Tuấn Anh (UI/UX)</option>
                  <option value="Phạm Minh Trí (Frontend)">Phạm Minh Trí (Frontend)</option>
                  <option value="Trần Thu Hà (Content)">Trần Thu Hà (Content)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                  Checklist việc con ban đầu:
                </label>
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="Ví dụ: Lên wireframe thiết kế..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
