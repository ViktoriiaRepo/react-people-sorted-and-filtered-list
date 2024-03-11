import { useState } from 'react';

import 'bulma/css/bulma.css';
import './App.scss';
import cn from 'classnames';

import peopleFromServer from '../public/api/people.json';
import { Button } from './components/Button/Button';
import { PeopleList } from './components/PeopleList/PeopleList';

const SORT_FIELD_ALPHABETICALLY = 'Sorted alphabetically by name';
const SORT_FIELD_BY_AGE = 'Sorted by age';

function getPreparedPeople(people, filterField, sortField) {
  let preparedPeople = [...people];

  if (filterField.query) {
    preparedPeople = preparedPeople.filter((person) => {
      const { name } = person;
      const foundPerson = name
        .toLowerCase()
        .trim()
        .includes(filterField.query.trim().toLowerCase());

      return foundPerson;
    });
  }

  if (filterField.gender !== 'all') {
    preparedPeople = preparedPeople.filter(
      (person) => person.sex === filterField.gender
    );
  }

  if (sortField.sortType === SORT_FIELD_ALPHABETICALLY) {
    preparedPeople = preparedPeople.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sortField.sortType === SORT_FIELD_BY_AGE) {
    preparedPeople = preparedPeople.sort((a, b) => a.born - b.born);
  }

  if (sortField.isReversed) {
    preparedPeople.reverse();
  }

  return preparedPeople;
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

  const resetButton = () => {
    setFilterField({ query: '', gender: 'all' });
    setSortField({ sortType: '', isReversed: false });
  };

  return (
    <div className='box'>
      <div className='block'>
        <div className='buttons has-addons'>
          <Button
            className={cn({
              'is-info': filterField.gender === 'all',
            })}
            onClick={() =>
              setFilterField((prevState) => ({
                ...prevState,
                gender: 'all',
              }))
            }
          >
            All
          </Button>

          <Button
            className={cn({ 'is-info': filterField.gender === 'm' })}
            onClick={() =>
              setFilterField((prevState) => ({
                ...prevState,
                ...filterField,
                gender: 'm',
              }))
            }
          >
            Man
          </Button>

          <Button
            className={cn({ 'is-info': filterField.gender === 'f' })}
            onClick={() =>
              setFilterField((prevState) => ({
                ...prevState,
                ...filterField,
                gender: 'f',
              }))
            }
          >
            Women
          </Button>
        </div>

        <div className='buttons has-addons'>
          <Button
            className={cn({
              'is-info': sortField.sortType === SORT_FIELD_ALPHABETICALLY,
            })}
            onClick={() => {
              setSortField((prevState) => ({
                isReversed: prevState.isReversed,
                sortType: SORT_FIELD_ALPHABETICALLY,
              }));
            }}
          >
            {' '}
            Sorted alphabetically by name
          </Button>

          <Button
            className={cn({
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
          </Button>

          <Button
            className={cn({ 'is-info': sortField.isReversed })}
            onClick={() => {
              setSortField((prevState) => ({
                ...prevState,
                isReversed: !sortField.isReversed,
              }));
            }}
          >
            Reverse
          </Button>
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

        <button
          type='button'
          className='button mt-3 is-info is-outlined'
          onClick={resetButton}
        >
          Reset
        </button>
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
          <PeopleList
            visiblePeople={visiblePeople}
            addPerson={addPerson}
            removePerson={removePerson}
            isSelected={isSelected}
          />
        </tbody>
      </table>
    </div>
  );
}

export default App;
