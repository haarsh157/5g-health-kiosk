import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PatientInfo = () => {
    const [patientData, setPatientData] = React.useState([]);   
    const [loading, setLoading] = React.useState(true);
    const { patientId } = useParams(); // Get the patientId from the URL

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctors/Patients/${patientId}/measurements`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setPatientData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching patient data:", error);
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []); 
  return (
    <div>
      
    </div>
  )
}

export default PatientInfo
