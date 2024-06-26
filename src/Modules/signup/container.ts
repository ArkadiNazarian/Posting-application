import { FormikErrors, useFormik } from "formik";
import { IFormModel, IModel } from "./model";
import *as yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export const useContainer = (): IModel => {

    const navigator = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null)

    const [uploaded_file, set_uploaded_file] = useState<any>();
    const [image_required, set_image_required] = useState<string>();
    const [image, set_image] = useState<string>();


    const initial_values: IFormModel = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: ""
    };

    const validation_schema = yup.object().shape({
        email: yup.string().email("Invalid email format").required("This field is required"),
        password: yup.string().min(6, "Too short").required("This field is required").matches(/^(?=.*[A-Z])/, 'Must contain at least one uppercase character').matches(/^(?=.*[a-z])/, 'Must contain at least one lowercase character').matches(/^(?=.*[0-9])/, 'Must contain at least one number'),
        first_name: yup.string().required("This field is required"),
        last_name: yup.string().required("This field is required"),
        confirm_password: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required("This field is required"),
    });

    const action_submit = (values: IFormModel) => {
        if (uploaded_file) {
            toast.info('Signing up', {
                position: toast.POSITION.TOP_RIGHT
            })
            const formData = new FormData()
            const imageFile = new File([uploaded_file], '01.png');
            formData.append('first_name', values.first_name)
            formData.append('last_name', values.last_name)
            formData.append('password', values.password)
            formData.append('email', values.email)
            formData.append('image', imageFile);

            axios.post('https://rn-api.codebnb.me/api/user/sign-up/', formData).then((result) => {
                navigator('/signin')
            }).catch((error) => {
                toast.error('Please try again', {
                    position: toast.POSITION.TOP_RIGHT
                })
            })
        } else {
            set_image_required("This field is required")
        }

    }

    const formik = useFormik({
        initialValues: initial_values,
        validationSchema: validation_schema,
        onSubmit: action_submit
    });

    const form_errors: FormikErrors<IFormModel> = {
        email: formik.submitCount || formik.touched.email ? formik.errors.email : "",
        first_name: formik.submitCount || formik.touched.first_name ? formik.errors.first_name : "",
        last_name: formik.submitCount || formik.touched.last_name ? formik.errors.last_name : "",
        password: formik.submitCount || formik.touched.password ? formik.errors.password : "",
        confirm_password: formik.submitCount || formik.touched.confirm_password ? formik.errors.confirm_password : ""
    };

    const go_to_signin = () => {
        navigator('/signin')
    }

    const handleonChnageUploadFile = (e: any) => {
        set_uploaded_file(e.target.files[0])
        set_image(URL.createObjectURL(e.target.files[0]))
    }

    return {
        action_submit: formik.handleSubmit,
        form_data: formik.values,
        form_errors: form_errors,
        handleChange: formik.handleChange,
        go_to_signin,
        inputRef,
        handleonChnageUploadFile,
        image_required,
        image
    }
}