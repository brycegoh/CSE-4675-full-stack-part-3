import { useState, useEffect } from "react";
import personsService from "./services/persons.js";
import "./app.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getAllPersons();
  }, []);

  const getAllPersons = () =>
    personsService.getAllPersons().then((res) => setPersons(res.data));

  const deletePerson = (id, name) => {
    const isConfirmed = window.confirm(`Delete ${name}?`);
    if (isConfirmed) {
      personsService.deletePerson(id).then((res) => {
        getAllPersons();
      });
    }
  };

  const addNewName = (e) => {
    e.preventDefault();
    setNewName(e.target.value.trim());
  };

  const addNewNumber = (e) => {
    e.preventDefault();
    setNewNumber(e.target.value.trim());
  };

  const notifyUser = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const similiarName = persons.filter((e) => e.name == newName);
    if (similiarName.length > 0) {
      const isConfirmed = window.confirm(
        `${newName} is already added to phonebook, replace old number with a new one?`
      );
      // window.alert(`${newName} is already added to phonebook`);
      if (isConfirmed) {
        const id = similiarName[0].id;
        personsService
          .updatePerson(id, newName, newNumber)
          .then((res) => {
            notifyUser({
              message: `Updated ${newName}`,
              type: `success`,
            });
            getAllPersons();
          })
          .catch((e) => {
            notifyUser({
              message:
                e?.response?.data?.error ||
                `Information of ${newName} has already been removed from the server`,
              type: `error`,
            });
            getAllPersons();
          });
      }
    } else {
      personsService
        .createNewPerson(newName, newNumber)
        .then((res) => {
          notifyUser({
            message: `Added ${newName}`,
            type: `success`,
          });
          getAllPersons();
        })
        .catch((err) => {
          notifyUser({
            message: `${err.response.data.error}`,
            type: `error`,
          });
        });
    }
  };

  const search = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const personsToDisplay =
    searchTerm.length > 0
      ? persons.filter((e) =>
          e.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
        )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      {message != null && <Notification message={message} />}

      <Search onSearch={search} />

      <Form
        addNewName={addNewName}
        addNewNumber={addNewNumber}
        submitForm={submitForm}
      />

      <DisplayPersons
        personsToDisplay={personsToDisplay}
        deletePerson={deletePerson}
      />
    </div>
  );
};

const Notification = ({ message }) => {
  return (
    <div className={message.type == "success" ? "success" : "error"}>
      {message.message}
    </div>
  );
};

const DisplayPersons = ({ personsToDisplay, deletePerson }) => (
  <>
    <h2>Numbers</h2>
    {personsToDisplay.map((person) => (
      <PersonDetails
        person={person}
        deletePerson={deletePerson}
        key={person.name}
      />
    ))}
  </>
);

const PersonDetails = ({ person, deletePerson }) => {
  return (
    <p>
      <b>{`${person.name} ${person.number}`}</b>{" "}
      <button onClick={() => deletePerson(person.id, person.name)}>
        delete
      </button>
    </p>
  );
};

const Form = ({ submitForm, addNewName, addNewNumber }) => (
  <>
    <h2>Add a new</h2>
    <form onSubmit={submitForm}>
      <div>
        name: <input onChange={addNewName} />
      </div>
      <div>
        number: <input onChange={addNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
);

const Search = ({ onSearch }) => (
  <div>
    filter shown with
    <input onChange={onSearch} />
  </div>
);

export default App;
