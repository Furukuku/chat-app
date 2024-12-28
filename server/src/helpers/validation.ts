import User, { IUser } from "../models/User";

type Validator<T> = {
  [Key in keyof T]: (keyof Rules | string)[]
};

interface Rules {
  required: (key: string, value: any) => Promise<string | void>;
  string: (key: string, value: any) => Promise<string | void>;
  min: (key: string, value: any, min: number) => Promise<string | void>;
  max: (key: string, value: any, max: number) => Promise<string | void>;
  confirmed: (key: string, value: any, confirmedValue: any, confirmedField: string) => Promise<string | void>;
  email: (key: string, value: any) => Promise<string | void>;
  unique: (key: string, value: any, property?: string) => Promise<string | void>;
}

export const validate = async <T>(model: T, validator: Validator<T>) => {
  const errors: { [Key in keyof T]?: string } = {};

  for (const key in validator) {
    for (const rule of validator[key]) {
      if (rule.includes(':')) {
        const [ruleName, ruleValue] = rule.split(':');

        if (ruleName === 'confirmed') {
          const error = await rules[ruleName as keyof Omit<Rules, 'max' | 'unique'>](key, model[key], model[ruleValue as keyof T], `${key} confirmation`);
          if (error) {
            errors[key] = error;
            break;
          }
        }

        if (ruleName === 'max') {
          const error = await rules[ruleName as keyof Omit<Rules, 'confirmed' | 'unique'>](key, model[key], parseInt(ruleValue));
  
          if (error) {
            errors[key] = error;
            break;
          }
        }

        if (ruleName === 'min') {
          const error = await rules[ruleName as keyof Omit<Rules, 'confirmed' | 'unique'>](key, model[key], parseInt(ruleValue));
  
          if (error) {
            errors[key] = error;
            break;
          }
        }

        if (ruleName === 'unique') {
          const error = await rules[ruleName as keyof Omit<Rules, 'confirmed' | 'max' | 'min'>](key, model[key], ruleValue);
  
          if (error) {
            errors[key] = error;
            break;
          }
        }

      } else {
        const error = await rules[rule as keyof Omit<Rules, 'max' | 'min' | 'confirmed' | 'unique'>](key, model[key]);
        if (error) {
          errors[key] = error;
          break;
        }
      }
    }
  }

  return {
    passed: Object.keys(errors).length === 0,
    errors: errors
  };
};

const rules: Rules = {
  required: async (key: string, value: any) => {
    if (!value && value.trim() === '') {
      return `The ${key} field is required.`;
    }
  },
  string: async (key: string, value: any) => {
    if (typeof value !== 'string') {
      return `The ${key} field must be a string.`;
    }
  },
  min: async (key: string, value: any, min: number) => {
    if (typeof value === 'string' && value.length < min){
      return `The ${key} field must be greater than or equal ${min} characters.`;
    }

    if (typeof value === 'number' && value > min){
      return `The ${key} field must be greater than or equal ${min}.`;
    }

    if (Array.isArray(value) && value.length > min){
      return `The ${key} field must have greater than or equal ${min} items.`;
    }

    if (typeof value === 'object' && Object.keys(value).length > min){
      return `The ${key} field must have greater than or equal ${min} properties.`;
    }
  },
  max: async (key: string, value: any, max: number) => {
    if (typeof value === 'string' && value.length > max){
      return `The ${key} field must be less than or equal ${max} characters.`;
    }

    if (typeof value === 'number' && value > max){
      return `The ${key} field must be less than or equal ${max}.`;
    }

    if (Array.isArray(value) && value.length > max){
      return `The ${key} field must have less than or equal ${max} items.`;
    }

    if (typeof value === 'object' && Object.keys(value).length > max){
      return `The ${key} field must have less than or equal ${max} properties.`;
    }
  },
  confirmed: async (key: string, value: any, confirmedValue: any, confirmedField: string) => {
    if (value != confirmedValue) {
      return `The ${confirmedField} does not match.`;
    }
  },
  email: async (key: string, value: any) => {
    const email = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;

    if (typeof value === 'string' && !email.test(value)) {
      return `The ${key} field must be a valid email address.`;
    }
  },
  unique: async (key: string, value: any, property?: string) => {
    const data = await User.find({ [property || key]: value });
    if (data.length > 0) {
      return `The ${key} has already been taken.`;
    }
  }
};