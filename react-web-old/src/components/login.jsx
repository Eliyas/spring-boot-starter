import React, { useEffect, useRef, useState } from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import "../styles/login.css"
import { object, string } from 'zod';
import { Controller, Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginResponse, setLoginResponse] = useState("");
    const [isLoginView, setIsLoginView] = useState(true);
    const toast = useRef(null);

    const loginDefault = {
        email: "",
        password: "",
    }

    const signUpDefault = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    }

    const loginForm = useForm({
        defaultValues: loginDefault
    });

    const signUpForm = useForm({
        defaultValues: signUpDefault
    });


    const handleLoginClick = () => {
        if (!isLoginView) {
            setIsLoginView(true);
            signUpForm.reset(signUpDefault)
        }
    }

    const handleSignUpClick = () => {
        if (isLoginView) {
            setIsLoginView(false);
            loginForm.reset(signUpDefault)
        }
    }

    const handleLogin = (data) => {
        console.log("login")
        axios.post("http://localhost:8086/api/v1/auth/authenticate", {
            email: data.email,
            password: data.password
        })
        .then(res => {
            if(res.data) setLoginResponse(JSON.stringify(res.data));
            toast.current.show({ severity: 'success', detail: 'Login successful' });
        }).catch((err) => {
            toast.current.show({ severity: 'error', detail: 'Login failed' });
        });
    }

    const handleSignUp = (data) => {
        console.log("SignUp")
        axios.post("http://localhost:8086/api/v1/auth/register", {
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            password: data.password,
            role: "USER"
        }).then(res => {
            toast.current.show({ severity: 'success', detail: 'Registration successful' });
            setIsLoginView(true);
            signUpForm.reset(signUpDefault)
        }).catch((err) => {
            if(err?.response?.data) {
                toast.current.show({ severity: 'error', detail: Object.values(err?.response?.data).join(", ") });
            } else {
                toast.current.show({ severity: 'error', detail: 'Registration failed' });
            }
        });
    }

    return (
        <div className='w-full login-wrapper'>
            <div className="card md:w-12 lg:w-10 xl:w-9 md:px-5">
                <Toast ref={toast} />

                <Card>
                    <div className="flex flex-column md:flex-row">
                        <div className="w-full md:w-4 flex flex-column align-items-center justify-content-center gap-3 py-5">
                            {
                                isLoginView && <>
                                    <form
                                        className="w-[100%]"
                                        noValidate
                                        autoComplete='off'
                                        onSubmit={loginForm.handleSubmit(handleLogin)}
                                    >
                                        <div className="gap-3 flex w-full flex-column">

                                            <div className="w-full flex flex-wrap justify-content-end align-items-center gap-2">
                                                <label className="w-6rem">Email</label>
                                                <div className='input-wrapper'>
                                                    <Controller
                                                        name="email"
                                                        control={loginForm.control}
                                                        rules={{ required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ }}
                                                        render={({ field: { onChange, value, ref } }) => (
                                                            <InputText id="username" required type="email" value={value}
                                                                ref={ref} onChange={onChange} className="w-full" />
                                                        )} />
                                                    {loginForm.formState.errors.email && (
                                                        <span style={{ color: "red" }} role="alert">
                                                            Email is invalid
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full flex flex-wrap justify-content-end align-items-center gap-2">
                                                <label className="w-6rem">Password</label>

                                                <Controller
                                                    name="password"
                                                    control={loginForm.control}
                                                    rules={{ required: true, minLength: 5 }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <div className="p-inputgroup input-wrapper">
                                                            <InputText required value={value}
                                                                ref={ref} onChange={onChange} className="w-full" type={showPassword ? "text" : "password"} />
                                                            <Button icon="pi pi-eye" className="p-button" onClick={() => setShowPassword(!showPassword)} />
                                                        </div>
                                                    )} />
                                                {loginForm.formState.errors.password && (
                                                    <span style={{ color: "red" }} role="alert">
                                                        Password must contains at least 6 characters
                                                    </span>
                                                )}

                                            </div>

                                            <div className='w-full flex justify-content-end align-content-end'>
                                                <Button label="Login" icon="pi pi-user" className="w-10rem" type='submit'></Button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            }
                            {!isLoginView &&
                                <div className='w-full flex justify-content-end align-content-end'>
                                    <Button label="Login" icon="pi pi-user" className="w-10rem" onClick={handleLoginClick}></Button>
                                </div>
                            }
                        </div>

                        <div className="w-full md:w-2">
                            <Divider layout="vertical" className="hidden md:flex">
                                <b>OR</b>
                            </Divider>
                            <Divider layout="horizontal" className="flex md:hidden" align="center">
                                <b>OR</b>
                            </Divider>
                        </div>

                        <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">

                            {
                                !isLoginView && <>
                                    <form
                                        className="w-[100%]"
                                        noValidate
                                        autoComplete='off'
                                        onSubmit={signUpForm.handleSubmit(handleSignUp)}
                                    >
                                        <div className="w-full flex w-full flex-column gap-3 py-5">

                                            <div className="w-full flex flex-wrap justify-content-end align-items-center gap-2">
                                                <label className="w-6rem">First Name</label>

                                                <Controller
                                                    name="firstName"
                                                    control={signUpForm.control}
                                                    rules={{ required: true }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <div className="p-inputgroup input-wrapper">
                                                            <InputText required type="text"
                                                                value={value} ref={ref} onChange={onChange} className="w-12rem" />
                                                        </div>
                                                    )} />
                                                {signUpForm.formState.errors.firstName && (
                                                    <div className='w-full flex justify-content-center align-items-center'>
                                                        <span style={{ color: "red" }} role="alert">
                                                            Please provide first name.
                                                        </span>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="w-full flex flex-wrap justify-content-end align-items-center gap-2">
                                                <label className="w-6rem">Last Name</label>
                                                <div className="p-inputgroup input-wrapper">
                                                    <Controller
                                                        name="lastName"
                                                        control={signUpForm.control}
                                                        render={({ field: { onChange, value, ref } }) => (
                                                            <InputText id="username" required type="text"
                                                                value={value} ref={ref} onChange={onChange} className="w-12rem" />
                                                        )} />
                                                </div>

                                            </div>

                                            <div className="w-full flex flex-wrap justify-content-end align-items-center gap-2">
                                                <label className="w-6rem">Email</label>

                                                <Controller
                                                    name="email"
                                                    control={signUpForm.control}
                                                    rules={{ required: true }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <div className="p-inputgroup input-wrapper">
                                                            <InputText required type="email" value={value}
                                                                ref={ref} onChange={onChange} className="w-full" />
                                                        </div>
                                                    )} />
                                                {signUpForm.formState.errors.email && (
                                                    <div className='w-full flex justify-content-center align-items-center'>
                                                        <span style={{ color: "red" }} role="alert">
                                                            Email is invalid
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full flex flex-wrap justify-content-end align-items-center gap-2">
                                                <label className="w-6rem">Password</label>

                                                <Controller
                                                    name="password"
                                                    control={signUpForm.control}
                                                    rules={{ required: true, minLength: 5 }}
                                                    render={({ field: { onChange, value, ref } }) => (
                                                        <div className="p-inputgroup input-wrapper">
                                                            <InputText required value={value}
                                                                ref={ref} onChange={onChange} className="w-full" type={showPassword ? "text" : "password"} />
                                                            <Button icon="pi pi-eye" className="p-button" onClick={() => setShowPassword(!showPassword)} />
                                                        </div>
                                                    )} />
                                                {signUpForm.formState.errors.password && (
                                                    <span style={{ color: "red" }} role="alert">
                                                        Password must contains at least 6 characters
                                                    </span>
                                                )}
                                            </div>

                                            <div className='w-full flex justify-content-end align-content-end'>
                                                <Button label="Sign Up" icon="pi pi-user-plus" severity="success" type="submit" className="w-10rem"></Button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            }

                            {isLoginView &&
                                <div className='w-full flex justify-content-end align-content-end'>
                                    <Button label="Sign Up" icon="pi pi-user-plus" severity="success" onClick={handleSignUpClick} className="w-10rem"></Button>
                                </div>
                            }

                            
                        </div>
                    </div>
                </Card>

                <div className='response-print'>
                { loginResponse}
                </div>
            </div >
        </div >
    );
};

export default Login;