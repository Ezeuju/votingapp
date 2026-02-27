import React from 'react';
import styles from './Dashboardshared.module.css';
import confirmStyles from './ConfirmModal.module.css';

/**
 * ConfirmModal – replaces native window.confirm() dialogs.
 *
 * Props:
 *   message   {string}   – e.g. "Are you sure you want to delete this donor?"
 *   onConfirm {function} – called when user clicks "Delete"
 *   onCancel  {function} – called when user clicks "Cancel" or closes
 */
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div
            className={styles.modalOverlay}
            onClick={e => e.target === e.currentTarget && onCancel()}
        >
            <div className={confirmStyles.confirmBox}>
                {/* Icon */}
                <div className={confirmStyles.iconWrap}>
                    <span className={confirmStyles.icon}>🗑️</span>
                </div>

                {/* Title */}
                <h3 className={confirmStyles.title}>Confirm Delete</h3>

                {/* Message */}
                <p className={confirmStyles.message}>{message}</p>

                {/* Actions */}
                <div className={confirmStyles.actions}>
                    <button
                        className={`${styles.btn} ${styles.btnOutline}`}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
