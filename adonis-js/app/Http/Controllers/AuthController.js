'use strict'

const User = use('App/Model/User')
const Validator = use('Validator')

class AuthController {
  * showRegisterPage (request, response) {
    yield response.sendView('auth.register')
  }

  * register (request, response) {
    const validation = yield Validator.validateAll(request.all(), User.rules)

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      return response.redirect('back')
    }

    const user = yield User.create({
      username: request.input('username'),
      email: request.input('email'),
      password: request.input('password')
    })

    yield request.auth.login(user)

    response.redirect('/')
  }

  * showLoginPage (request, response) {
    yield response.sendView('auth.login')
  }

  * login (request, response) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      yield request.auth.attempt(email, password)
      response.redirect('/')
    }catch (e) {
      yield request.with({ error: 'Invalid credentials' }).flash()
      response.redirect('back')
    }
  }
}

module.exports = AuthController
