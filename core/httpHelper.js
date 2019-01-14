module.exports = {
  createHeader: function() {
    return {
      headers: { Authorization: `Bearer ${global.token}` }
    };
  }
};
