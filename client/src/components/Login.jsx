import React,{ useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const Login = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);

}