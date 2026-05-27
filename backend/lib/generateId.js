function generateId(prefix) {
  return `${prefix}-${Date.now()}`;
}

module.exports = generateId;
