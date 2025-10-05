React Lab – Task Tracker (State + Event Handling)
  
The goal is to understand how to:  
- Capture user input using React state and event handling.
- Manage an array of tasks using useState.
- Wire basic event handlers to buttons (Submit, Delete, Clear All).


------------------------------------------------------------
Setup
------------------------------------------------------------
1. Open VS Code and go to the terminal.  
2. Move into the project folder by running:  
   cd 5-3-react-event-handling  
3. Install the required node modules by running:  
   npm install or npm i  
4. To see the output, start the development server by running:  
   npm run dev  

Note: In order to gain good marks in the lab, please follow the lab instructions strictly.  

------------------------------------------------------------
Task to write int the input field
------------------------------------------------------------
Enter these semester project tasks in the input:  
- Make group  
- Prepare proposal  
- Make prototype  
- Implement front-end  
- Implement backend  
- Deploy project  

------------------------------------------------------------
Task 1 – Capture Input
------------------------------------------------------------
1. In TaskApp.jsx, add an onChange handler to the input field.
2. In TaskApp.jsx, use the React useState hook to create a state variable named text.
   Example: const [text, setText] = useState("");  
3. Bind the input field to this state so it becomes a controlled input.
   - Use value={text} on the input element.
   - Add an onChange handler that updates the state as the user types.
4. Display the current value of text below the input field. 

Hints:  
- Use onChange on the input element to call setText(e.target.value).
- Controlled input means React manages what appears in the input.

Example:
   <input
   value={text}
   onChange={(e) => setText(e.target.value)}
   placeholder="Type a task..."
   />
   <p>{text}</p>  

------------------------------------------------------------
Task 2 – Submit Button → Pass Props and Display
------------------------------------------------------------
1. In TaskApp.jsx, create another state variable to hold all tasks:
   Example: const [tasks, setTasks] = useState([]);
2. When the Submit button is clicked, add the current input value (text) to this array as a new object { id, text }.
3. After adding, clear the input field (setText to an empty string).
4. Display the list of tasks by passing the tasks array as props to TaskList.
5. In TaskList.jsx, loop through the array using .map() and display each task inside TaskItem.
6. In TaskItem.jsx, show the text inside the <span>.

Hints:  
- Always update state immutably:
   setTasks(prev => [...prev, { id: Date.now(), text }]);
- Don’t allow empty submissions — check text.trim() before adding. 
- Example idea:
   <button onClick={handleSubmit}>Submit</button>
   where handleSubmit updates both tasks and clears text.

------------------------------------------------------------
Task 3 – Delete Button
------------------------------------------------------------
1. In TaskItem.jsx, add an onClick handler to the Delete button.
2. When clicked, remove the selected task from the tasks array using the task’s unique id.
3. To do this, define a delete handler in TaskApp.jsx and pass it down to TaskList and then to TaskItem through props.
4. Inside TaskItem, call onDelete(id) when the Delete button is clicked.  

Hints:
- Use the array filter() method to remove a task:
   setTasks(prev => prev.filter(t => t.id !== id));
- Always use immutable updates — do not use .splice() or .push().
   Example idea:
      <button onClick={() => onDelete(id)}>Delete</button>
 

------------------------------------------------------------
Task 4 – Clear All Button
------------------------------------------------------------
1. In TaskApp.jsx, add an onClick handler to the Clear All button.
2. When clicked, set the tasks array back to an empty array.
3. This should make the task list disappear and show the placeholder message again in TaskList.jsx.

Hints:
- Use:
   setTasks([]);
- You can add a function like handleClearAll in TaskApp and attach it to the button’s onClick.
   Example idea:
      <button onClick={handleClearAll}>Clear All</button>

Extra Hints:
- Each task should have a unique key (use task.id) when rendering in a list.
- You can submit by pressing the Enter key — check onKeyDown for "Enter".
- Don’t mutate the original tasks array — always return a new array from setTasks.
- Keep your components small:
   - TaskApp → holds state and handlers.
   - TaskList → renders the list.
   - TaskItem → displays a single task and Delete button.  


