export interface InputProps {
  getValue: string;
  setValue: (phoneNumber: string) => void;
  getError: string;
  setError: (error: string) => void;
  helperText?: string;
}
