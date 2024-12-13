import { useState } from 'react'
import {Form, Input, Container, Row, Col, Button, ButtonGroup} from 'reactstrap'
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/'
import { register } from './routes';

const Login = (props) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [login, setLogin] = useState("")
    
    const handleSubmit = () => {
        auth({login, password})
    }    

    return (
        <Container>
            <Row xs="2">
                <Col xl={{
                    offset: 3,
                    size: 6
                }}>
                <div style={{
                    minHeight: "100vh",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: 'center'
                }}>
                    
                    <Form className='d-flex justify-content-center align-items-center flex-column form'>
                    <h3>Авторизація</h3>
                        <Input 
                            type="text"
                            placeholder='Введіть свій нікнейм'
                            className='input'
                            onChange={e => setLogin(e.target.value)}
                        />
                        <Input
                            onChange={e => setPassword(e.target.value)}
                            type='password'
                            placeholder='Введіть пароль'
                            className='input'
                        />
                        <ButtonGroup className='pt-3 pb-1'>
                            <Button type='button' onClick={handleSubmit}>У кабінет</Button>
                            <Button color="dark" onClick={() => navigate(register)} type='button'>Зареєструватись</Button>
                        </ButtonGroup>
                    </Form>    
                </div>
                    
                </Col>
            </Row>    
        </Container>
    )
}

export default Login