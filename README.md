# Alt-school-blogging-API

userModel.js: This consist of the users schemas

blogModel.js: This file consists of the  blog schema

userRoutes.js:
This file consist of the signup and login routes, it also consist of a middleware used for verifying users token gotten from cookies.

blogRoutes.js:
This consist of the blogs routes and also I imported the verification middleware so it could be used for protecting some of our blog post routes.

- The /allpost routes is used for getting only published routes and displaying to both logged in and not logged in users

- The /blog/:id routes is used for getting a published blog by it id

- The /createBlog route is used for creating a new blog

- The /publish/:id route is used for changing the state of a blog from "draft" to "published"

- The /editBlog/:id routes is used for updating our blogs either in draft or published state

-The /deleteBlog/:id  routes is used for deleting our blogs either in draft or published state

- The /personalBlog routes is for gettin our personal routes in draft state

- The /search route is used to get a blog by it title
