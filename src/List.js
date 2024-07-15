import { useState, useEffect } from "react";
import "./List.css";

function List({ getRemaining }) {
  const [list, setList] = useState([]);

  var counter = 0;
  list.filter((item) => {
    return item.completed === false && counter++;
  });

  console.log(counter);

  useEffect(() => {
    getRemaining(counter);
  });

  async function getRecords() {
    const response = await fetch(`http://localhost:8080/api/v1/tasks`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const records = await response.json();
    setList(records);
  }

  ////////////////////////////////////// This area fetches the Tasks
  useEffect(() => {
    getRecords();

    return;
  }, []);

  /////////////////////////////////// This is the handler for creating a task
  async function handleSubmit(e) {
    e.preventDefault();
    const newTask = document.getElementById("newTask").value;
    console.log("Adding: ", newTask);
    if (newTask.length > 0) {
      const toPost = {
        description: newTask,
        completed: false,
        created: Date(),
      };
      const response = await fetch("http://localhost:8080/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(toPost),
      });

      if (response.ok) {
        console.log("It worked");
      }
    }
    getRecords();
  }
  //////////////////////////////////// This is the handler for when you delete a task
  async function handleDelete(val) {
    console.log("Request delete for: " + val);
    const res = await fetch(`http://localhost:8080/api/v1/tasks/${val}`, {
      method: "DELETE",
    });

    getRecords();
  }
  //////////////////////////////////// This is the handler for when you check a task off
  async function handleComplete(val) {
    console.log("Requesting status change for: " + val.description);

    const response = await fetch(
      `http://localhost:8080/api/v1/tasks/${
        val.id
      }?completed=${!val.completed}`,
      {
        method: "PUT",
      }
    );

    console.log("response: ", response);

    getRecords();
  }

  console.log(list);
  ////////////////////////////////////////////// This maps the current list
  const mappedItems = list.map((item) => {
    return (
      <li
        key={item.id}
        className={
          item.completed ? "task-container-completed" : "task-container"
        }
      >
        <div className="checkbox-container">
          <input
            className="checkbox"
            type="checkbox"
            defaultChecked={item.completed}
            onChange={() => {
              handleComplete(item);
            }}
          />
        </div>
        <div className="text-container">
          <span className="task-text">{item.description}</span>
        </div>
        <div className="del-btn-container">
          <button
            className="del-btn"
            onClick={() => {
              handleDelete(item.id);
            }}
          >
            X
          </button>
        </div>
      </li>
    );
  });
  ////////////////////////////////////// This is what renders
  return (
    <>
      <form onSubmit={handleSubmit} className="new-task-field">
        <input className={"new-task-text"} id="newTask" />
        <button className={"new-task-button"} type="submit">
          +
        </button>
      </form>
      <div className="all-tasks-container">
        {list.length > 0
          ? mappedItems
          : "Im sure you can find something to do 😉"}
      </div>
    </>
  );
}

export default List;
