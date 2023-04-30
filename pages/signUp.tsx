import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap'
import { useUser } from '../hooks/useUser'
import isEmail from 'isemail';

const SignIn: NextPage = () => {

    const { signUp } = useUser();
    const [ user, setUser ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ password2, setPassword2 ] = useState('');
    const [ error, setError ] = useState('');

    const onSignUp = async () => {
        try {
            validator();
            await signUp(user, password);
        } catch (e: any){
            parseError(e);
        }
    }

    const parseError = (error) => {
        if(error?.response?.data?.error) {
            setError(error?.response?.data?.error);
        } else {
            setError(error?.message ?? 'Theres an error');
        }
    }

    const validator = () => {
        if(!isEmail.validate(user)) {
            throw new Error(`${user} isn't a valid email`);
        }

        if(password !== password2) {
            throw new Error(`Passwords are not equal`);
        }


        if(password.length < 4) {
            throw new Error(`Passwords must be longer than 3`);
        }
    }

    return (
        <Container>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={user} 
                        onInput={(e: ChangeEvent<HTMLInputElement>) => setUser(e.target.value) } 
                        placeholder="Enter email" 
                    />
                    <Form.Control.Feedback type="invalid">
                        Please choose a username.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password} 
                        onInput={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) } 
                        placeholder="Password" 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Repeat password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password2} 
                        onInput={(e: ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value) } 
                        placeholder="Password 2" 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword" hidden={!error}>
                    <Form.Text  style={({ color: 'red' })}>
                        {error}
                    </Form.Text>
                </Form.Group>

                <Button 
                    variant="primary" 
                    onClick={ () => onSignUp() }
                    disabled={ !user || !password }
                    style={({ marginLeft: '10px' })}
                >
                    Sign up
                </Button>
            </Form>
        </Container>
    )
}

export default SignIn
