import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';

const employeeHardCode = { // delete
  id: 1,
  name: "Carlos",
  email: "carlos@gmail.com",
  department: {
    id: 1,
    name: "Sales"
  }
};

const List = () => {

  //estado da página
  const [page, setPage ] = useState<SpringPage<Employee>>();

  const handlePageChange = (pageNumber: number) => {
    // to do
  };

  return (
    <>
      <Link to="/admin/employees/create">
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
      </Link>

      <EmployeeCard employee={employeeHardCode} />
      <EmployeeCard employee={employeeHardCode} />
      <EmployeeCard employee={employeeHardCode} />
      <EmployeeCard employee={employeeHardCode} />

      <Pagination
        forcePage={0}
        pageCount={1}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
