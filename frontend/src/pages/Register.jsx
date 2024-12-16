import { useState } from 'react'
import {Form, Input, Container, Row, Col, Button, ButtonGroup, Badge, Spinner} from 'reactstrap'
import { useNavigate } from 'react-router-dom';
import { register } from '../api/'
import { dashboard, login as routeLogin } from './routes';

const Register = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [login, setLogin] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const handleSubmit = async () => {
        setLoading(true)
        setError("")
        const res = await register(login, password)
        setLoading(false)
        if (res.message === 'success') {
            navigate(dashboard)
        } else {
            setError(res.message)
        }
        setPassword('')
        setLogin('')
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
                    <h3>Реєстрація</h3>
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
                        {error && (
                            <div className='justrify-center'>
                                <Badge color='danger'>{error}</Badge>
                            </div>
                        )}
                        
                        <ButtonGroup className='pt-3 pb-1 justify-center'>
                            <Button type='button' onClick={handleSubmit} disabled={loading}>{loading ? <Spinner/> : "Зареєструватись"}</Button>
                            <Button color="dark" onClick={() => navigate(routeLogin)} type='button'>Авторизуватись</Button>
                        </ButtonGroup>
                    </Form>    
                </div>
                    
                </Col>
            </Row>    
        </Container>
    )
}

export default Register