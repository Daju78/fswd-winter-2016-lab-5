# Full Stack Web Development - Homework/Project: Multi-user Todo Lists!

Changes! I organized the files a bit. All the user/registration related Express
code is now in `lib/app/routes/user.js`, all the task related Express code is
now in `lib/app/routes/todo.js`.

I also added testing tasks to the `gulp` setup. First, run `createdb fswd_lab_5_test`
if you have not already, then run `gulp watch:test:backend` before you start
working and it will keep running the tests I have written for the following
tasks. A number of them fail right now, so update the code to meet the descriptions
contained in this, and they should pass. And please feel free to add your own
tests if that will help any.

## Tasks

* Update the express handler for the registration form POST (`/users/new`)
  to handle the following new cases:
  * When a user fills out the registration form and the password fields do not
    match (the `password` and `password_confirm` form fields in the
    `request.body` object), return them to the registration page with a warning
    that says "Passwords must match"
  * When a user fills out the registration form with a user that already exists
    (determined by the submitted username already existing in the `User` table),
    return them to the registration page with a warning that says "User already
    exists"
* Add a template and routes needed to handle logins for existing users.
  * `views/login.jade`

    The login template (`views/login.jade`) will have a single form with two
    fields (`username` and `password`) and a button.

  * Express function for `GET /users/login`

    It needs to render the `views/login.jade` template.

  * Express function for `POST /users/login`

    The POST function needs to find the matching user in the database (if there
    is one) and compare the submitted password with the saved password for that
    user.

    * If the user exists and the passwords match, add the id of the user from
      the database to the session (like the `/users/new` registration function
      does) and redirect the user to the main index page (`/`)
    * If no user with that username could be found, return them to the login
      template with a warning that says "User not found".
    * If the user is found but the submitted password does not match the
      password in the database, return them to the login template with a warning
      that says "Password incorrect".
