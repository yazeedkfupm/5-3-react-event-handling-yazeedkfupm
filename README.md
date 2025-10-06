[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/wiJZiwXu)
# React Lab – Task Tracker (Event Handling)

⚠️ **Note:** Please follow the `instructions.txt` file to implement the TODOs.
This README file is only for the **overview of the lab** and the **concepts used**.

## Lab Overview

In this lab, you will practice **event handling and state management in React** while building a simple **Task Tracker** application.  
The Task Tracker allows you to type a task, add it to a list, delete tasks individually, and clear all tasks at once — all by updating React **state** in response to user events.

You have already learned about **components** and **props** in previous labs.  
This lab builds on those concepts by introducing **state**, which lets React components remember and manage data over time.  

You will use the **`useState`** hook to store two types of state:
- The **current input value** typed by the user.  
- The **array of tasks** that updates dynamically as you add or remove tasks.

By combining **state** and **event handling**, your Task Tracker will become fully interactive — automatically re-rendering whenever the user submits, deletes, or clears tasks.   

---

## Read Assignment
Review the section on event handling in React:  
[5.8 Event Handling](https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/5/section/8)<br>
[5.9 State](https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/5/section/9)

---

## What is Event Handling?

**Event handling** in React means writing code that responds to user actions such as typing in a text box, clicking a button, or submitting a form.  

### Why do we use Event Handling?
- To make web pages **interactive**.  
- To respond to user input (e.g., typing, clicking, selecting).  
- To trigger actions like **adding a task**, **deleting a task**, or **submitting a form**.  

### How to do Event Handling in React?
- React uses **camelCase** event names (e.g., `onClick`, `onChange`) instead of lowercase like in HTML.  
- You pass a **function** as the event handler, not a string.  
- Example syntax:  
  ```jsx
  <button onClick={handleClick}>Click Me</button>
  ```  

### Types of Event Handling in React
Common events include:  
- **onClick** → triggered when a button or element is clicked.  
- **onChange** → triggered when input value changes (typing in a text field).  
- **onSubmit** → triggered when submitting a form.  
- **onKeyDown / onKeyUp** → triggered when a key is pressed or released.  
- **onMouseEnter / onMouseLeave** → triggered when the mouse enters or leaves an element.  

---

## Concepts Used in This Lab
Besides **components** and **props** (already covered before), you will use the following:

### Event Handler Functions
Functions that respond to an event. In React, you usually define them inside your component.  

**Syntax:**
```jsx
function handleEvent() {
  // action performed when the event occurs
}
```

### onClick
Attaches an event handler to an element that executes when the element is clicked.  

**Syntax:**
```jsx
<button onClick={handlerFunction}>Click Me</button>
```

### onChange
Used mainly with inputs. Fires whenever the input value changes.  

**Syntax:**
```jsx
<input type="text" onChange={handlerFunction} />
```

### Passing Functions as Props
You can pass a handler function from a parent component to a child component, so the child can trigger actions in the parent.  

**Syntax:**
```jsx
<ChildComponent onAction={handlerFunction} />
```

### What is State?
In React, **state** refers to data that a component manages internally and that can change over time.  
When the state changes, React automatically **re-renders** the component to reflect the new data on the screen.  
This allows you to build dynamic, responsive interfaces that react to user actions such as typing, clicking buttons, or submitting forms.

### Why is State Important?
Without state, React components are static — they only display data passed in through props.  
With state, components can **store, update, and display changing data** without requiring a page reload.  
For example, you might use state to keep track of:
- The value entered into an input field.
- A count that increases when a button is clicked.
- Whether a UI element is visible or hidden.

### The useState Hook
React provides a built-in Hook called **`useState`** that lets you add state to a functional component.

#### Importing the Hook
```jsx
import { useState } from "react";
```

#### Declaring a State Variable
```jsx
const [variableName, setVariableName] = useState(initialValue);
```
- `variableName` → current value of the state  
- `setVariableName` → function used to update the state  
- `initialValue` → starting value of the state (for example, `""`, `0`, or `[]`)

#### Updating State
To update a state variable, call its setter function:
```jsx
setVariableName(newValue);
```

#### Accessing State
You can use the state variable directly inside your JSX or component logic:
```jsx
<p>{variableName}</p>
```

### Key Points to Remember
- Each state variable stores one type of data (string, number, array, object, etc.).
- Always use the **setter function** to update state — never modify it directly.
- Updating state causes React to **re-render** the component.
- You can use multiple `useState` hooks in a single component to manage different pieces of data.
- When updating state based on a previous value, use the **updater function** form:
  ```jsx
  setVariableName(prev => prev + 1);
  ```

---

By understanding state and event handling, you’ll be able to create components that respond to user input and update automatically when data changes.

## Understanding the map() Function in React

In this lab, you will see the `.map()` function used to render a list of tasks.  
This function is a very common way to display multiple items dynamically in React.

### What is map()?
- `.map()` is a JavaScript array method.  
- It loops over each element in an array and applies a function to it.  
- It returns a **new array** with the results of that function.  

### Syntax
```javascript
array.map((element, index) => {
  // return something for each element
});
```

### Parameters
- **element** → The current item in the array (for example, a task string like `"Make group"`).  
- **index** → The position of the item in the array (0 for the first item, 1 for the second, etc.).  

### Example in React
```jsx
{props.tasks.map((t, i) => (
  <TaskItem key={i} text={t} />
))}
```

### Explanation of Example
- `props.tasks` is an array that contains all the tasks.  
- `t` represents the current task (e.g., `"Prepare proposal"`).  
- `i` represents the index of that task in the array.  
- For each task in the array, we return a `<TaskItem />` component.  
- The `key={i}` is required by React to uniquely identify each list item and optimize rendering.  
- The task text (`t`) is passed as a prop into `<TaskItem />`.  

---

## Checklist Before Lab Submission

Make sure you have completed the following before submitting:

- [ ] The input field is a **controlled component** — its value is managed using React **state** (`useState`).  
- [ ] Typing in the input updates the state correctly and displays the text on the screen.  
- [ ] Clicking **Submit** adds a new task object to the state array (using an **immutable update** with `setTasks`).  
- [ ] Each task in the list displays correctly using the `map()` function.  
- [ ] Each task has a **Delete** button that removes only that specific task from the list (using `filter()` and immutable updates).  
- [ ] Clicking **Clear All** resets the state array to an empty list and displays the placeholder message again.  
- [ ] State updates do **not** use direct mutations (e.g., no `.push()`, `.splice()`, or direct editing of the state array).  
- [ ] Code is properly indented, well-organized, and separated into components:  
  - `TaskApp.jsx` → state and handlers  
  - `TaskList.jsx` → rendering of the task list  
  - `TaskItem.jsx` → individual task and delete functionality  
- [ ] Only the required tasks from the semester project are used as input:  
  - Make group  
  - Prepare proposal  
  - Make prototype  
  - Implement front-end  
  - Implement backend  
  - Deploy project  

