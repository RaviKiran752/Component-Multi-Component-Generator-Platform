const Session = require('../models/Session');

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sessions', error: err.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { chat, code, css } = req.body;
    const session = await Session.create({
      user: req.user.id,
      chat: chat || [],
      code: code || '',
      css: css || '',
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create session', error: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch session', error: err.message });
  }
}; 