import { useState } from 'react';

import 'bulma/css/bulma.css';
import './App.scss';
import cn from 'classnames';

import peopleFromServer from '../public/api/people.json';

const SORT_FIELD_ALPHABETICALLY = 'Sorted alphabetically by name';
const SORT_FIELD_BY_AGE = 'Sorted by age';
function getPreparedPeople(people, filterField, sortField) {
  let visiblePeople = [...people];

  if (filterField.query) {
    visiblePeople = visiblePeople.filter((person) => {
      const { name } = person;
      const foundPerson = name
        .toLowerCase()
        .trim()
        .includes(filterField.query.trim().toLowerCase());

      return foundPerson;
    });
  }

  if (filterField.gender !== 'all') {
    visiblePeople = visiblePeople.filter(
      (person) => person.sex === filterField.gender
    );
  }

  if (sortField.sortType === SORT_FIELD_ALPHABETICALLY) {
    visiblePeople = visiblePeople.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortField.sortType === SORT_FIELD_BY_AGE) {
    visiblePeople = visiblePeople.sort((a, b) => a.born - b.born);
  }

  if (sortField.isReversed) {
    console.log('reverse', sortField.isReversed);
    visiblePeople.reverse();
  }

  return visiblePeople;
}

function App() {
  // #region People Selection Logic
  const [selectedPeople, setSelectedPerson] = useState([]);
  const [filterField, setFilterField] = useState({
    query: '',
    gender: 'all',
  });

  const [sortField, setSortField] = useState({
    sortType: '',
    isReversed: false,
  });

  const visiblePeople = getPreparedPeople(
    peopleFromServer,
    filterField,
    sortField
  );

  const isSelected = ({ slug }) => selectedPeople.some((p) => p.slug === slug);

  const addPerson = (person) => {
    setSelectedPerson([...selectedPeople, person]);
  };

  const removePerson = (person) => {
    setSelectedPerson(selectedPeople.filter((p) => p.slug !== person.slug));
  };

  return (
    <div className='box'>
      <div className='block'>
        <div className='buttons has-addons'>
          <button
            type='button'
            className={cn('button', {
              'is-info': filterField.gender === 'all',
            })}
            onClick={() =>
              setFilterField((prevState) => ({
                ...prevState,
                ...filterField,
                gender: 'all',
              }))
            }
          >
            All
          </button>
          <button
            type='button'
            className={cn('button', { 'is-info': filterField.gender === 'm' })}
            onClick={() =>
              setFilterField((prevState) => ({
                ...prevState,
                ...filterField,
                gender: 'm',
              }))
            }
          >
            Man
          </button>
          <button
            type='button'
            className={cn('button', { 'is-info': filterField.gender === 'f' })}
            onClick={() =>
              setFilterField((prevState) => ({
                ...prevState,
                ...filterField,
                gender: 'f',
              }))
            }
          >
            Women
          </button>
        </div>

        <div className='buttons has-addons'>
          <button
            type='button'
            className={cn('button', {
              'is-info': sortField.sortType === SORT_FIELD_ALPHABETICALLY,
            })}
            onClick={() => {
              setSortField((prevState) => ({
                isReversed: prevState.isReversed,
                sortType: SORT_FIELD_ALPHABETICALLY,
              }));
            }}
          >
            Sorted alphabetically by name
          </button>

          <button
            type='button'
            className={cn('button', {
              'is-info': sortField.sortType === SORT_FIELD_BY_AGE,
            })}
            onClick={() => {
              setSortField((prevState) => ({
                isReversed: prevState.isReversed,
                sortType: SORT_FIELD_BY_AGE,
              }));
            }}
          >
            Sorted by age
          </button>

          <button
            type='button'
            className={cn('button', { 'is-info': sortField.isReversed })}
            onClick={() => {
              setSortField((prevState) => ({
                ...prevState,
                isReversed: !sortField.isReversed,
              }));
            }}
          >
            Reverse
          </button>
        </div>
        <div className=' is-flex is-flex-direction-column'>
          <div className='select is-primary'>
            <select
              style={{ width: '270px' }}
              value={sortField.sortType}
              onChange={(event) => {
                const selectedSortType = event.target.value;
                setSortField((prevState) => ({
                  ...prevState,
                  sortType: selectedSortType,
                }));
              }}
            >
              <option value=''>--Please choose an option--</option>
              <option value={SORT_FIELD_ALPHABETICALLY}>
                Sorted alphabetically by name
              </option>
              <option value={SORT_FIELD_BY_AGE}>Sorted by age</option>
            </select>
          </div>
          <input
            className='input is-primary mt-3 is-normal control '
            style={{ width: '270px' }}
            type='search'
            value={filterField.query}
            placeholder='Please enter a search term'
            onChange={(event) => {
              setFilterField({ ...filterField, query: event.target.value });
            }}
          />
        </div>
      </div>
      <h1 className='title'>People table</h1>

      <table className='table is-striped is-narrow'>
        <caption>
          {selectedPeople.map((p) => p.name).join(', ') || 'No one selected'}
        </caption>

        <thead>
          <tr>
            <th> </th>
            <th>name</th>
            <th>sex</th>
            <th>born</th>
          </tr>
        </thead>

        <tbody>
          {visiblePeople.map((person) => (
            <tr
              key={person.slug}
              className={isSelected(person) ? 'has-background-warning' : ''}
            >
              <td>
                {isSelected(person) ? (
                  <button
                    type='button'
                    className='button is-small is-rounded is-danger'
                    onClick={() => removePerson(person)}
                  >
                    <span className='icon is-small'>-</span>
                  </button>
                ) : (
                  <button
                    type='button'
                    className='button is-small is-rounded is-success'
                    onClick={() => addPerson(person)}
                  >
                    <span className='icon is-small'>+</span>
                  </button>
                )}
              </td>
              <td>{person.name}</td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
