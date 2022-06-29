import './styles.css';

import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Department } from 'types/department';
import { useForm } from 'react-hook-form';
import { Employee } from 'types/employee';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';

type UrlParams = {
  employeeId: string;
};

const Form = () => {
  const { employeeId } = useParams<UrlParams>();

  const isEditing = employeeId !== 'create';

  const history = useHistory();

  //departments do backend - inicializando lista vazia
  const [selectDepartments, setSelectDepartments] = useState<Department[]>([]);

  const { 
    register, 
    handleSubmit,
    formState: {errors},  
    setValue,
   } = useForm<Employee>();

  useEffect(() => {
    requestBackend({ url: '/departments' }).then((response) => {
      setSelectDepartments(response.data.content);
    });
  }, []);

  useEffect(() => {
    //se estiver editando, preenche os dados do form
    if (isEditing) {
      // carregar os dados de employee - chama requisição do backend - chamando direto
      requestBackend({ url: `/employees/${employeeId}` }).then((response) => {
        const employee = response.data as Employee;

        setValue('name', employee.name);
        setValue('email', employee.email);
        setValue('department', employee.department);
      });
    }
  }, [isEditing, employeeId, setValue]); //dependencias

  const onSubmit = (formData: Employee) => {
    /* configuração da requesição para salvar o Employee */

    const data = {
      ...formData,
    };

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/employee/${employeeId}` : '/employees',
      data,
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info('Empregado cadastrado com sucesso!');
        history.push('/admin/employees');
      })
      .catch(() => {
        toast.error('Erro ao cadastrar empregado');
      });
  };

  const handleCancel = () => {
    // to do
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
                { ...register('email', {
                  required: 'Campo obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                }
                })}
                type="text"
                className={`form-control base-input ${errors.email ? 'is-invalid' : ''} `} 
                placeholder="E-mail"
                name='email'
                data-testid="email"
                />
                <div className="invalid-feedback d-block">
                  {errors.email?.message}
                </div>
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
