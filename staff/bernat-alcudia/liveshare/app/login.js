//presentation layer

var form = document.querySelector('.form')

form.onsubmit = function (event) {
    event.preventDefault()
    var usernameInput = form.querySelector('#username')
    var username = usernameInput.value

    var passwordInput = form.querySelector('#password')
    var password = passwordInput.value


    try {

        loginUser(username, password)
        console.log('user logged in ')
        alert('user logged in')
        form.reset()

    } catch (error) {
        console.error(error.massage)

        alert(error.massage)
    }
}