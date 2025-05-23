
{/* This componenet in the input field for sign in/sign up pop up form */}
import React from 'react';


const InputField = ({ onChange, label, type, name, id, placeholder, value, autoComplete, className }) => {



  return (

    <div className="flex flex-col gap-3 mb-1 text-white">

      <label 
        htmlFor={name} 
        className="flex flex-col gap-1 mt-1 mx-1 text-white">
        {label}
      </label>

      <input 
        onChange={onChange} 
        type={type}
        name={name}
        id={id} 
        placeholder={placeholder} 
        value={value || ""} 
        autoComplete={autoComplete}
        className={className}
      />

    </div>
  );
};

    

export default InputField;