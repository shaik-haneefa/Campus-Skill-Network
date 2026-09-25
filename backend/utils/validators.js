/**
 * Validates registration input fields
 */
const validateRegisterInput = (data) => {
  const errors = {};
  const { name, email, studentId, department, year, password, confirmPassword } = data;

  if (!name || name.trim() === '') {
    errors.name = 'Full name is required';
  }

  if (!email || email.trim() === '') {
    errors.email = 'College email is required';
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please provide a valid email format';
    } else if (process.env.COLLEGE_EMAIL_DOMAIN) {
      const allowedDomain = process.env.COLLEGE_EMAIL_DOMAIN.toLowerCase().trim();
      if (!email.toLowerCase().endsWith(allowedDomain)) {
        errors.email = `Please use your official college email ending with ${allowedDomain}`;
      }
    }
  }

  if (!studentId || studentId.trim() === '') {
    errors.studentId = 'Student ID is required';
  }

  if (!department || department.trim() === '') {
    errors.department = 'Department is required';
  }

  if (!year || year.trim() === '') {
    errors.year = 'Academic year is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateRegisterInput,
};
