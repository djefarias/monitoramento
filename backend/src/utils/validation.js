function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    throw new Error(`${fieldName} is required`);
  }
}

module.exports = {
  validateEmail,
  validatePhone,
  validateRequired
};
