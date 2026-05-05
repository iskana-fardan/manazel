const success = (data, message, meta) => ({
  success: true,
  ...(message != null && { message }),
  ...(data != null && { data }),
  ...(meta != null && { meta }),
});

const failure = (message) => ({ success: false, message });

module.exports = { success, failure };
