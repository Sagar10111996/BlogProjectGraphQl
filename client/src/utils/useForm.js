import { useState } from "react";

function useForm (inititalState, callbackFunction) {

  const [values, setValues] = useState(inititalState);
  
  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }

  const onSubmit = (event) => {
    event.preventDefault()
    callbackFunction()
  }

  return {
    values, 
    onChange,
    onSubmit
  }
}

export { useForm }

