import React, { useState, useEffect } from "react";
import { ref, push, set, get } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./LeadFormModal.css";

const LeadFormModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUserKey = localStorage.getItem("userKey");
  const customFormsRef = ref(database, `admins/${storedUserKey}/customForms`);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const snapshot = await get(customFormsRef);

        if (snapshot.exists()) {
          const formsData = snapshot.val();
          let allFields = [];

          for (let formKey in formsData) {
            if (formsData.hasOwnProperty(formKey)) {
              const fieldsData = formsData[formKey].fields;
              const fieldIndexes = Object.keys(fieldsData);

              fieldIndexes.forEach((index) => {
                const field = fieldsData[index];
                // Create a sanitized key from the label (remove spaces, special chars, etc.)
                const fieldKey = field.label 
                  ? field.label.toLowerCase().replace(/\s+/g, '_')
                  : `field_${index}`;
                
                allFields.push({
                  ...field,
                  index: index,
                  formKey: formKey,
                  fieldKey: fieldKey // Add the sanitized key to the field data
                });
              });
            }
          }

          console.log("Fetched Fields:", allFields);

          setFields(allFields);

          // Initialize formData with empty values using fieldKey as the key
          const initialFormData = allFields.reduce((acc, field) => {
            acc[field.fieldKey] = ""; // Initialize each field with an empty string using fieldKey
            return acc;
          }, {});

          setFormData(initialFormData);
        } else {
          console.error("No forms found in the database.");
        }
      } catch (error) {
        console.error("Error fetching fields: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const storedUserKey = localStorage.getItem("userKey");

    if (!storedUserKey) {
      alert("User not found");
      return;
    }

    // Transform formData to use label-based keys
    const transformedData = {};
    fields.forEach(field => {
      const fieldKey = field.fieldKey;
      transformedData[fieldKey] = formData[fieldKey];
    });

    const newLead = { 
      ...transformedData, // Use the transformed data with label-based keys
      createdAt: new Date().toISOString(),
      status: "New",
      lastContact: "Just now",
    };

    try {
      const leadsRef = ref(database, `admins/${storedUserKey}/leads`);
      const newLeadRef = push(leadsRef);
      await set(newLeadRef, newLead);

      alert("Lead created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading form fields...</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Lead</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          {fields.map((field) => {
            const { inputType, label, placeholder, fieldKey, options } = field;

            const safeLabel = label && typeof label === 'string' ? label : "Untitled Field";
            const safePlaceholder = placeholder && typeof placeholder === 'string' ? placeholder : `Enter ${safeLabel}`;

            return (
              <div key={fieldKey} className="form-group">
                <label>{safeLabel}</label>
                {inputType === "select" ? (
                  <select
                    name={fieldKey} // Use fieldKey as the name
                    value={formData[fieldKey]}
                    onChange={handleChange}
                  >
                    {options && options.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={inputType}
                    name={fieldKey} // Use fieldKey as the name
                    placeholder={safePlaceholder}
                    value={formData[fieldKey]}
                    onChange={handleChange}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="modal-footer">
          <button className="create-job-btn" onClick={handleSubmit}>
            ✨ Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;