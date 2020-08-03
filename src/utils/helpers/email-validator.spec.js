const EmailValidator = require('./email-validator')
const validator = require('validator')

const makeSut = () => {
  const emailValidatorSpy = new EmailValidator()

  return emailValidatorSpy
}

describe('Email validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should return true if validator returns true', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email')
    expect(isEmailValid).toBe(false)
  })

  test('Should call validator with correct email', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    sut.isValid('email')
    expect(validator.email).toBe('email')
  })

  test('Should throw if email is not provided', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    expect(sut.isValid).toThrow()
  })
})
