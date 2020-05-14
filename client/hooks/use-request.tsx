import axios from 'axios';
import { useState } from 'react';

interface IRequestTypes {
  url: string;
  method: string;
  body: any;
  onSuccess: any;
}

export default ({ url, method, body, onSuccess }: IRequestTypes) => {
  const [errors, setErrors] = useState<any>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      // @ts-ignore
      const response = await axios[method](url, body);

      // after a successful response
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops.....</h4>
          <ul className="my-0">
            {err.response?.data.errors.map((err: any) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
