import axios from "axios";
import { reactive, ref } from "vue";

interface Options<T> {
  onSuccess?: () => void;
  onFinished?: () => void;
  onError?: (errors?: {[K in keyof T]: string}) => void;
}

type TDataErr<T> = {[K in keyof T | string]: string};

const useForm = <TData>(initialData: {[K in keyof TData]: TData[K]}) => {
  const data = reactive({...initialData});
  const errors = ref<TDataErr<TData> | null>(null);
  const loading = ref<boolean>(false);

  const reset = () => {
    Object.assign(data, initialData);
  };

  const post = async (url: string, options?: Options<TData>) => {
    const { onSuccess, onError, onFinished } = options || {};
    loading.value = true;
    try {
      const response = await axios.post(url, data);
      if (response.status === 201) {
        errors.value = null;
        if (onSuccess) {
          onSuccess();
        }
      } 

      errors.value = {};
      return response.data;
    } catch (err: any) {
      if (err.response && (err.response.status === 422  || err.response.status === 401) && err.response.data) {
        errors.value = err.response.data.errors;
      }

      if (onError) {
        onError();
      }
    } finally {
      loading.value = false;
      if (onFinished) {
        onFinished();
      }
    }
  };

  return { data, loading, errors, post, reset } as const;
};

export default useForm;