const Group = require('./group.model');

const groupService = {
  getAll: async () => await Group.findAll(),
  create: async (data) => await Group.create(data),
  delete: async (id) => await Group.remove(id),
};

module.exports = groupService;
