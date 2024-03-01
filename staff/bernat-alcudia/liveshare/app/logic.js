function registerUser(name, birthdate, username, email, password) {
    //bussines layer


    if (name.length < 1) {
        throw new Error('name is lower than 1 character')
    }
    var nameIsBlank = true
    for (var i = 0; i < name.length && nameIsBlank; i++) {
        var char = name[i];

        if (char !== " ") {
            nameIsBlank = false
        }
    }



    if (nameIsBlank) {
        throw new Error('name is blank')

    }
    if (birthdate.length !== 10) {
        throw new Error('name does not have 10 characters')
    }

    if (birthdate.includes(' ')) {
        throw new Error('birthdate has a space character')
    }

    if (birthdate.indexOf('-') !== 4 || birthdate.lastIndexOf('-') !== 7) {
        throw new Error(' birthdate dashes are not correct position')
    }

    if (username.length < 3) {
        throw new Error('username is lower than 3 characters')
    }
    if (username.includes(' ')) {
        throw new Error('username has a space character')

    }
    if (email.length < 6) {
        throw new Error('email is lower than 6 characters')
    }

    if (!email.includes('@')) {
        throw Error('email has no @')
    }

    if (!email.includes('.')) {
        throw Error('email has no .')
    }

    if (email.lastIndexOf('.') < email.indexOf('@')) {
        throw Error('email has . before @')
    }

    if (email.lastIndexOf('.') - email.indexOf('@') < 2) {
        throw Error('email has . next to @')
    }

    if (email.length - 1 - email.indexOf('.') < 2) {
        throw Error('email domain is lower than 2 characters')

    }

    if (email.includes(' ')) {
        throw new Error('email has a space character')
    }

    if (password.length < 8) {
        throw new Error('password is lower than 8  characters')
    }


    if (password.includes(' ')) {
        throw Error('password has a space character')
    }


    for (var i = 0; i < users.length; i++) {
        var user = users[i];

        if (user.email === email) {
            throw new Error('user alredy exists')
        }

    }



    var user = {
        name: name,
        birthdate: birthdate,
        username: username,
        email: email,
        password: password
    }

    users[users.length] = user
    localStorage.users = JSON.stringify(users)

}

function loginUser(username, password) {

    if (username.length < 3) {
        throw new Error('username is lower than 3 characters')
    }
    if (username.includes(' ')) {
        throw new Error('username has a space character')
    }

    if (password.length < 8) {
        throw new Error('password is lower than 8  characters')
    }


    if (password.includes(' ')) {
        throw Error('password has a space character')
    }

    var user

    for (let i = 0; i < users.length; i++) {
        var user2 = users[i]
        if (user2.username === username) {
            user = user2

            break
        }
    }

    if (user === undefined) {
        throw new Error('user not found')
    }

    if (user.password !== password) {
        throw new Error('wrong password')

    }

}
