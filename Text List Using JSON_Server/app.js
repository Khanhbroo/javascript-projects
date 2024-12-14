// API variable
let userAPI = "http://localhost:3000/users";
// Define the base URL for the API where user data is stored (used for fetching, creating, and deleting users).

function start() {
    getUser(renderUsers);
    handleCreateForm();
}
// The `start` function initializes the application by:
// 1. Fetching the list of users from the API and rendering them on the page.
// 2. Setting up the form event listener for creating new users.

start();
// Call the `start` function to kick off the application.

function getUser(callback) {
    fetch(userAPI)
        .then(function(response) {
            return response.json();
        })
        .then(callback);
}
// The `getUser` function fetches user data from the API and passes it to the provided callback (in this case, `renderUsers`).

function renderUsers(users) {
    let userList = document.querySelector("#user-list");
    let html = users.map(function(user) {
        return `<li class="user-item-${user.id}">
                <h4>${user.name}</h4>
                <p>${user.description}</p>
                <button onclick="handleDeleteUser(${user.id})">&times;</button>
                </li>`;
    });

    userList.innerHTML = html.join("");
}
// The `renderUsers` function generates HTML for a list of users and displays it in the element with id `user-list`.
// - Each user has a delete button, which calls `handleDeleteUser` when clicked.

function createUser(data) {
    let option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    fetch(userAPI, option)
        .then(function(response) {
            return response.json();
        })
        .then(function() {
            getUser(renderUsers);
        });
}
// The `createUser` function sends a POST request to the API to create a new user with the provided data.
// After the user is created, it refreshes the user list by calling `getUser(renderUsers)`.

function handleCreateForm() {
    let createBtn = document.querySelector("#create");
    createBtn.onclick = function() {
        let nameInput = document.querySelector("input[name=\"name\"]");
        let descriptionInput = document.querySelector("input[name=\"description\"]");

        let data = {
            name: nameInput.value,
            description: descriptionInput.value,
        };

        createUser(data);
    };
}
// The `handleCreateForm` function sets up an event listener on the "Create" button.
// When the button is clicked, it collects input values from the form, creates a data object, and calls `createUser` to add the new user.

function handleDeleteUser(id) {
    let option = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    };

    fetch(userAPI + "/" + id, option)
        .then(function() {
            let userId = document.querySelector(".user-item-" + id);
            userId.remove();
        });
}
// The `handleDeleteUser` function sends a DELETE request to the API for a specific user by ID.
// After deletion, it removes the corresponding user element from the DOM to avoid an extra API call.
