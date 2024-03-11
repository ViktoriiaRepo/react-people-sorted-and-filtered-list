import PropTypes from 'prop-types';

export const PeopleList = ({
  visiblePeople = [],
  removePerson = () => {},
  addPerson = () => {},
  isSelected = () => {},
}) => {
  return (
    <>
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
    </>
  );
};

PeopleList.propTypes = {
  visiblePeople: PropTypes.array,
  removePerson: PropTypes.func,
  addPerson: PropTypes.func,
  isSelected: PropTypes.func,
};
