import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

export default function Form() {
  const [post, setPost] = useState();
  // managing state for our form inputs
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    terms: ""
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    terms: ""
  });

  const formSchema = yup.object().shape({
    name: yup
    .string()
    .required("*Name is a required field"),
    email: yup
      .string()
      .email("*You must use a valid email address")
      .required(),
    terms: yup
    .boolean()
    .oneOf([true], "*Please click checkbox to agree"),
  });

  const validateChange = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch(err => {
        console.log("error!", err);
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
      });
  };

  console.log("error state", errors);
  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      console.log("valid?", valid);
      setIsButtonDisabled(!valid);
    });
  }, [formState]);

  // onSubmit function
  const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(response => {
        setPost(response.data);
        setFormState({
          name: "",
          email: "",
          terms: ""
        });
      })
      .catch(err => console.log(err.response));
  };

  // onChange function
  const inputChange = e => {
    console.log("input changed!", e.target.value);
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };
    validateChange(e);
    setFormState(newFormData);
  };


  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input
          id="name"
          type="text"
          name="name"
          onChange={inputChange}
          value={formState.name}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
      </label>


      <label htmlFor="email">
        Email
        <input
          type="text"
          name="email"
          onChange={inputChange}
          value={formState.email}
        />
        {errors.email.length > 0 ? ( <p className="error">{errors.email}</p>) : null}
      </label>


      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms & Conditions
      </label>
      <pre>{JSON.stringify(post, null, 2)}</pre>


      <button disabled={isButtonDisabled} type="submit">
        Submit
      </button>
      
    </form>
  );
}
