# TheLotter TODOs Exam
![image](https://github.com/user-attachments/assets/744e0bb2-7416-4951-b151-463ed6e73222)
![image](https://github.com/user-attachments/assets/85608192-8d65-4ad1-84f0-3c9863eeb158)

## Application Description

The ToDo List Manager is a comprehensive task management application designed for operational teams to efficiently track, sort, and handle various types of tasks. The system allows operation managers to view, filter, and update the status of tasks based on their specific domains of expertise.

### Key Features
- Task visualization with detailed information including title, content, creation time, and due date
- Sorting capabilities by status (active/done) and due date
- Task status updates with persistent storage
- Filtering options by task type (Results, Wins, Withdraw)
- Pagination for handling large volumes of tasks
- Efficient search functionality to quickly locate specific tasks

The application is built on a modern tech stack featuring a React frontend for responsive and interactive user interfaces, paired with a .NET Core backend that provides robust API services and data management. This architecture ensures high performance, scalability, and maintainability for handling operational workflows.

## Getting Started

1. Install the project dependencies:
   ```bash
   # In the project root
   npm i
   
   # In the client directory
   cd client
   npm i
   ```

2. Run the project:
   ```bash
   # From the root directory
   npm run dev
   ```

3. You should now have the development version running on your computer and accessible via:
   ```
   http://localhost:3000
   ```

## Tasks

### Part 1 - TODO Item UI and Functionality

#### 1a. Fix Infinite Loop Bug
We have a bug whenever an agent tries to see all of the TODO items. There is an infinite loop of calling the server (check the network tab). It causes the same items to render again and again. Please fix it.

#### 1b. Fix Key Prop Warning
There is an error in the console: "Warning: Each child in a list should have a unique 'key' prop". Fix that.

#### 1c. Show Item Content
Our TODO Item list is only showing the title and creation time. Make it show the content as well.

#### 1d. Add Status Sorting
Our TODOs item list is not sorted by status. Our agents would like to be able to sort the items according to active/done status. Add a sort option at the top of the screen with the text "Order by status:" and a drop-down with 2 possible options: "active", "done".

#### 1e. Add Status Update Functionality
Once an operation manager has finished handling a TODO item, they would like to set it as Done. Add a button per item to enable the operation manager to update the item status. Once the status changes, make sure you re-sort the list.

#### 1f. Add Date Sorting
It's important to handle all TODOs according to the due date. Currently, items are not displayed according to it. Add a button at the top of the screen 'Sort by date' with asc/desc options.

### Part 2 - Performance and Scale

#### 2a. Implement Pagination
Every time the page reloads, we get back all the items in the DB. This is not good in case there are many items. We would like to support paging and only get back partial results according to items per page (amount) and the page number. Please add this functionality.

#### 2b. Optimize Database Access
Going to the DB (fs) in order to get back the data for every request is costly. Can you think of a way to reduce the DB roundtrips?

#### 2c. Add Type Filtering
Some operations managers have expertise in certain domains, which means they can only handle specific types of TODOs. We would like to support a way for them to choose what types of TODO items they would like to see on the page. Add a filter option in the TODO item list on the client with possible options "Results", "Wins", "Withdraw". According to the selection, generate a server call to get back only this type of item.

#### 2d. Persist Status Changes
(In accordance with 1e) Once an operation manager has changed the TODO item status, we would like to persist the change in the DB. Add the logic to the client and the server to support it.

### Part 2e - Bonus Task

We got a request from the operation team to be able to find TODO items by a specific "key". For example, they would like to get all items that contain the key "awaiting". Add this functionality.

**After we added this ability to search by keyword, our DB grows exponentially very soon, and now it takes very long to get the response from the server.**

Let's create a super search mechanism:

1. Add a query param `?fastSearch=` to the `/todos` API call and implement an *efficient* search solution that gets a word as an input and returns an array of matching tickets.

2. Our code is not following best practices rules; it is not well structured and not reusable. Try to make it better.

3. Sometimes it takes time to load all the relevant TODOs. Add a Progress bar indication.

## General Notes

* Code should compile and run without any warnings.

* Basic requirements must be met.

* Consider best practices, edge cases, performance, and scale.

* The bonus is just a bonus, don't start with it. Good luck!
