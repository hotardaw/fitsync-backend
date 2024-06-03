const isValidEmail = (email) => {
  const EMAIL_REGEX = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/
  return EMAIL_REGEX.test(email)
}

const isValidPassword = (password) => {
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)\w{8,}$/
  return PASSWORD_REGEX.test(password)
}

// isAcceptableUsername, isRealBirthdate

module.exports = { isValidEmail }
