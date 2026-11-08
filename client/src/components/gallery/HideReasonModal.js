import React, { useState } from 'react';
import '../../styles/HideReasonModal.css';

const HideReasonModal = ({ isOpen, onClose, onConfirm, currentHideLevel = 'visible' }) => {
  const [hideLevel, setHideLevel] = useState(currentHideLevel);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Violates terms of service',
    'Inappropriate content',
    'Copyright concern',
    'Pending moderation',
    'User request',
    'Safety reasons',
  ];

  const hideLevels = [
    { value: 'visible', label: 'Visible', description: 'Public - Everyone can see' },
    { value: 'soft_hide', label: 'Soft Hide (Unlisted)', description: 'Hidden from gallery, accessible via direct link' },
    { value: 'hard_hide', label: 'Hard Hide', description: 'Completely hidden from public, owner/admin can see' },
    { value: 'archived', label: 'Archive', description: 'Admin only access, can be permanently deleted' },
  ];

  const handleConfirm = () => {
    const finalReason = reason === 'custom' ? customReason : reason;
    onConfirm({
      hideLevel,
      reason: finalReason || null,
      note: note || null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="hide-reason-modal-overlay" onClick={onClose}>
      <div className="hide-reason-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="hide-reason-modal-header">
          <h2 className="hide-reason-modal-title">
            Content Visibility Settings
          </h2>
          <button className="hide-reason-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="hide-reason-modal-body">
          {/* Hide Level Selection */}
          <div className="form-section">
            <label className="form-label">Visibility Level *</label>
            <div className="hide-level-grid">
              {hideLevels.map((level) => (
                <div
                  key={level.value}
                  className={`hide-level-option ${hideLevel === level.value ? 'selected' : ''}`}
                  onClick={() => setHideLevel(level.value)}
                >
                  <div className="hide-level-label">{level.label}</div>
                  <div className="hide-level-description">{level.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason Selection (only if hiding) */}
          {hideLevel !== 'visible' && (
            <>
              <div className="form-section">
                <label className="form-label">Reason (Optional)</label>
                <select
                  className="form-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">-- Select a reason --</option>
                  {predefinedReasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="custom">Custom reason...</option>
                </select>
              </div>

              {reason === 'custom' && (
                <div className="form-section">
                  <label className="form-label">Custom Reason</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter custom reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    maxLength={500}
                  />
                </div>
              )}

              <div className="form-section">
                <label className="form-label">Additional Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add any additional details or context..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={1000}
                  rows={3}
                />
                <div className="character-count">{note.length}/1000</div>
              </div>
            </>
          )}
        </div>

        <div className="hide-reason-modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            {hideLevel === 'visible' ? 'Make Visible' : 'Apply Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HideReasonModal;