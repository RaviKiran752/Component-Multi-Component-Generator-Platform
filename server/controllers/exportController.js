const Session = require('../models/Session');
const archiver = require('archiver');

exports.exportSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.sessionId, user: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="session-${session._id}.zip"`
    });

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => { throw err; });
    archive.pipe(res);

    archive.append(session.code || '', { name: 'Component.tsx' });
    archive.append(session.css || '', { name: 'style.css' });
    archive.finalize();
  } catch (err) {
    res.status(500).json({ message: 'Export failed', error: err.message });
  }
}; 