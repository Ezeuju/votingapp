const services = [];

module.exports = {
  register(service) {
    services.push(service);
  },
  getAll() {
    return services;
  }
};
