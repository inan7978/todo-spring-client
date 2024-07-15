import { useState, useEffect } from "react";
import "./List.css";

function List({ getRemaining }) {
  const [list, setList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [newTask, setNewTask] = useState("");

  var counter = 0;
  list.filter((item) => {
    return item.completed === false && counter++;
  });

  console.log(counter);

  useEffect(() => {
    getRemaining(counter);
  });

  ////////////////////////////////////// This area fetches the Tasks
  useEffect(() => {
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

    getRecords();

    return;
  }, [list.length]);

  /////////////////////////////////// This is the handler for creating a task
  async function handleSubmit(e) {
    e.preventDefault();
    if (newTask.length > 0) {
      const toPost = {
        description: newTask,
        completed: false,
        created: "1987-04-02",
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

    setNewTask("");
    if (list.length > 1) {
      setList([]);
    } else {
      setList(["testing", "this"]);
    }
  }
  //////////////////////////////////// This is the handler for when you delete a task
  async function handleDelete(val) {
    console.log("Request delete for: " + val._id);
    const res = await fetch(`http://localhost:3002/${val._id}`, {
      method: "DELETE",
    });
    const result = list.filter((item) => {
      return item._id !== val._id;
    });
    if (res) {
      setList([]);
    }
  }
  //////////////////////////////////// This is the handler for when you check a task off
  async function handleComplete(val) {
    setDoneList([...doneList], val);

    console.log("Requesting status change for: " + JSON.stringify(val));

    const toPatch = {
      description: val.task,
      completed: !val.completed,
    };

    console.log("To patch completed" + toPatch.completed);

    const response = await fetch(`http://localhost:3002/${val._id}`, {
      method: "PATCH",
      body: JSON.stringify(toPatch),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response) {
      if (list.length > 1) {
        setList([]);
      } else {
        setList(["testing", "this"]);
      }
    }
  }

  console.log(list);
  ////////////////////////////////////////////// This maps the current list
  const mappedItems = list.map((item) => {
    return (
      <li
        key={list.indexOf(item)}
        className={
          item.completed ? "task-container-completed" : "task-container"
        }
      >
        <div className="checkbox-container">
          <input
            className="checkbox"
            type="checkbox"
            defaultChecked={item.completed}
            onChange={(e) => {
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
              handleDelete(item);
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
        <input
          className={"new-task-text"}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
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
