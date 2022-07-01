import './styles.css';

import { toast } from 'react-toastify';
import { useHistory} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Department } from 'types/department';
import { Controller, useForm } from 'react-hook-form';
import { Employee } from 'types/employee';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';
import Select from 'react-select';

const Form = () => {

  const history = useHistory();

  const [selectDepartments, setSelectDepartments] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },    
  } = useForm<Employee>();

  useEffect(() => {
    requestBackend({
      method: 'GET',
      url: '/departments',
       withCredentials: true,
    }).then((response) => {
      setSelectDepartments(response.data.content);
    });
  }, []);


  const onSubmit = (formData: Employee) => {

    const data = {
      ...formData,
    };

    const config: AxiosRequestConfig = {
      method:  'POST',
      url:  '/employees',
      data: data,
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info('Cadastrado com sucesso');
        history.push('/admin/employees');
      })
      .catch(() => {
        toast.error('Erro ao cadastrar');
      });
  };

  const handleCancel = () => {

    history.push('/admin/employees');
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">
              <div className="margin-bottom-30">
                <input
                  {...register('name', {
                    required: 'Campo obrigadtório',
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.name ? 'is-invalid' : ''
                  } `}
                  placeholder="Nome do empregado"
                  name="name"
                  data-testid="name"
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input
                  {...register('email', {
                    required: 'Campo obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                  type="text"
                  className={`form-control base-input ${
                    errors.email ? 'is-invalid' : ''
                  } `}
                  placeholder="E-mail"
                  name="email"
                  data-testid="email"
                />
                <div className="invalid-feedback d-block">
                  {errors.email?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <label htmlFor="department" className="d-none">
                  Departamento
                </label>
                <Controller
                  name="department"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectDepartments}
                      classNamePrefix="employee-crud-select"
                      getOptionLabel={(department: Department) =>
                        department.name
                      }
                      getOptionValue={(department: Department) =>
                        String(department.id)
                      }
                      inputId="department"
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block">Campo obrigatório</div>
                )}
              </div>
            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
