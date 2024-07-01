// DeleteConfirmationModal.js
import React from 'react';
import Modal from 'react-modal';

const DeleteConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Confirmation"
      className="confirm-delete-modal"
      overlayClassName="confirm-delete-overlay"
    >
      <h2>Confirm Delete</h2>
      <p>{message}</p>
      <div className="modal-buttons">
        <button onClick={onConfirm} className="confirm-delete-btn">Confirm</button>
        <button onClick={onRequestClose} className="cancel-delete-btn">Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
