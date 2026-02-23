// src/COMPONENTS/DashboardScreens/DashboardContactUs.jsx
import React, { useState } from 'react';
import styles from '../../CSS-MODULES/Contactus.module.css';
import shared from './Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';

const STATUS_CLASS = {
  Unread:  styles.statusUnread,
  Read:    styles.statusRead,
  Replied: styles.statusReplied,
};

const EMPTY_FORM = {
  fullName: '',
  email:    '',
  subject:  '',
  message:  '',
};

const INIT_MESSAGES = [
  { id: 1, fullName: 'Emeka Okafor',  email: 'emeka@mail.com',  subject: 'Partnership Enquiry',          message: 'Hello, I would like to discuss potential collaboration opportunities with your team for the upcoming season. We represent a media company with wide reach across West Africa.',           date: 'Feb 20, 2026', time: '10:32 AM', status: 'Unread'  },
  { id: 2, fullName: 'Ngozi Eze',     email: 'ngozi@mail.com',  subject: 'Ticket Refund Request',        message: 'Good day. I purchased two VIP tickets for the grand finale but unfortunately I will be unable to attend due to a travel emergency. Please advise on the refund process.',            date: 'Feb 19, 2026', time: '2:15 PM',  status: 'Replied' },
  { id: 3, fullName: 'Kwame Asante',  email: 'kwame@mail.com',  subject: 'Media Coverage Request',       message: 'We are a registered media house based in Accra, Ghana. We are interested in covering your upcoming auditions and would love to request press credentials for our team.',             date: 'Feb 18, 2026', time: '9:05 AM',  status: 'Read'    },
  { id: 4, fullName: 'Fatima Musa',   email: 'fatima@mail.com', subject: 'General Enquiry',              message: 'Hi, I would like to know the age requirements for auditioning. My daughter is 16 years old and very talented. Please advise if she is eligible to participate in Season 3.',        date: 'Feb 17, 2026', time: '5:44 PM',  status: 'Unread'  },
  { id: 5, fullName: 'Tunde Alli',    email: 'tunde@mail.com',  subject: 'Audition Venue Confirmation',  message: 'Could you please confirm the venue address and parking arrangements for the Lagos audition date? I will be travelling from Ibadan and want to plan ahead. Thank you.',               date: 'Feb 16, 2026', time: '11:20 AM', status: 'Replied' },
];

const DashboardContactUs = () => {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [modal, setModal]       = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [form, setForm]         = useState(EMPTY_FORM);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleAdd = () => {
    if (!form.fullName || !form.email || !form.subject || !form.message) return;
    const entry = {
      id: Date.now(),
      ...form,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      status: 'Unread',
    };
    setMessages(p => [entry, ...p]);
    setForm(EMPTY_FORM);
    setModal(false);
  };

  const handleDelete = id => setMessages(p => p.filter(m => m.id !== id));

  const handleStatus = (id, status) =>
    setMessages(p => p.map(m => m.id === id ? { ...m, status } : m));

  const handleView = (msg) => {
    if (msg.status === 'Unread') handleStatus(msg.id, 'Read');
    setViewEntry({ ...msg, status: msg.status === 'Unread' ? 'Read' : msg.status });
  };

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    const matchSearch =
      (m.fullName || '').toLowerCase().includes(q) ||
      (m.email    || '').toLowerCase().includes(q) ||
      (m.subject  || '').toLowerCase().includes(q);
    const matchFilter = filter === 'All' || m.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    total:   messages.length,
    unread:  messages.filter(m => m.status === 'Unread').length,
    read:    messages.filter(m => m.status === 'Read').length,
    replied: messages.filter(m => m.status === 'Replied').length,
  };

  return (
    <div>
      {/* ── Stat Strip ── */}
      <div className={styles.statStrip}>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>💬</span>
          <div>
            <div className={styles.statStripValue}>{counts.total}</div>
            <div className={styles.statStripLabel}>Total Messages</div>
          </div>
        </div>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>🔔</span>
          <div>
            <div className={styles.statStripValue}>{counts.unread}</div>
            <div className={styles.statStripLabel}>Unread</div>
          </div>
        </div>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>👁️</span>
          <div>
            <div className={styles.statStripValue}>{counts.read}</div>
            <div className={styles.statStripLabel}>Read</div>
          </div>
        </div>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>✉️</span>
          <div>
            <div className={styles.statStripValue}>{counts.replied}</div>
            <div className={styles.statStripLabel}>Replied</div>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={shared.sectionHeader}>
        <span className={shared.sectionTitle}>💬 <span>Contact Messages</span></span>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Message
        </button>
      </div>

      {/* ── Search ── */}
      <div className={shared.searchWrap}>
        <span className={shared.searchIcon}>🔍</span>
        <input
          className={shared.searchInput}
          placeholder="Search by name, email or subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className={styles.filterTabs}>
        {['All', 'Unread', 'Read', 'Replied'].map(f => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f === 'Unread' && counts.unread > 0 ? `(${counts.unread})` : ''}
          </button>
        ))}
      </div>

      {/* ── Message List ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💬</div>
          No messages found
        </div>
      ) : (
        <div className={styles.messageList}>
          {filtered.map(m => (
            <div
              key={m.id}
              className={`${styles.messageCard} ${m.status === 'Unread' ? styles.messageCardUnread : ''}`}
            >
              <div className={styles.msgAvatar}>{(m.fullName || '?')[0]}</div>
              <div className={styles.msgBody}>
                <div className={styles.msgTop}>
                  <span className={styles.msgName}>{m.fullName}</span>
                  <span className={styles.msgDate}>{m.date} · {m.time}</span>
                </div>
                <div className={styles.msgEmail}>{m.email}</div>
                <div className={styles.msgSubject}>{m.subject}</div>
                <div className={styles.msgPreview}>{m.message}</div>
                <div className={styles.msgActions}>
                  <button
                    className={`${shared.btn} ${shared.btnPrimary} ${shared.btnSm}`}
                    onClick={() => handleView(m)}
                  >
                    Read
                  </button>
                  {m.status !== 'Replied' && (
                    <button
                      className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                      onClick={() => handleStatus(m.id, 'Replied')}
                    >
                      Mark Replied
                    </button>
                  )}
                  <span className={STATUS_CLASS[m.status]}>{m.status}</span>
                  <button
                    className={`${shared.btn} ${shared.btnDanger} ${shared.btnSm}`}
                    style={{ marginLeft: 'auto' }}
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Message Modal ── */}
      {modal && (
        <DashboardModal title="New Contact Message" onClose={() => { setModal(false); setForm(EMPTY_FORM); }}>
          <div className={shared.formGrid}>

            <div className={shared.formGroup}>
              <label className={shared.label}>Full Name</label>
              <input className={shared.input} placeholder="e.g. Emeka Okafor"
                value={form.fullName} onChange={e => field('fullName', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Email Address</label>
              <input className={shared.input} type="email" placeholder="e.g. emeka@email.com"
                value={form.email} onChange={e => field('email', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Subject</label>
              <input className={shared.input} placeholder="e.g. Partnership Enquiry"
                value={form.subject} onChange={e => field('subject', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Message</label>
              <textarea className={shared.textarea} placeholder="Write the message here..."
                value={form.message} onChange={e => field('message', e.target.value)}
                style={{ minHeight: 120 }} />
            </div>

          </div>
          <div className={shared.modalActions}>
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => { setModal(false); setForm(EMPTY_FORM); }}>
              Cancel
            </button>
            <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={handleAdd}>
              Save Message
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── Full Message View Modal ── */}
      {viewEntry && (
        <DashboardModal title="Message" onClose={() => setViewEntry(null)}>
          <div className={styles.msgFullSubject}>{viewEntry.subject}</div>
          <div className={styles.msgFullMeta}>
            <span className={styles.msgFullMetaItem}>👤 {viewEntry.fullName}</span>
            <span className={styles.msgFullMetaItem}>📧 {viewEntry.email}</span>
            <span className={styles.msgFullMetaItem}>📅 {viewEntry.date} · {viewEntry.time}</span>
            <span className={STATUS_CLASS[viewEntry.status]}>{viewEntry.status}</span>
          </div>
          <div className={styles.msgFullBody}>{viewEntry.message}</div>
          <div className={shared.modalActions}>
            {viewEntry.status !== 'Replied' && (
              <button
                className={`${shared.btn} ${shared.btnGreen}`}
                onClick={() => { handleStatus(viewEntry.id, 'Replied'); setViewEntry(null); }}
              >
                ✉️ Mark as Replied
              </button>
            )}
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => setViewEntry(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardContactUs;