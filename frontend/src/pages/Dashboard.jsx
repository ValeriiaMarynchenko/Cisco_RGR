import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap"
import { useNavigate } from 'react-router-dom';
import {fetchHome} from '../api'
import {login} from './routes'
import { DOLLARIcon, EURIcon, UAHIcon } from "../assets/icons";

const Dashboard = (props) => {
    const navigate = useNavigate()
    const [rate, setRate] = useState(null);
    const [userName, setUserName] = useState('')
    const [bonds, setBonds] = useState(null)
    const [joke, setJoke] = useState(null)

    useEffect(() => {
        const getData = async () => {
            const response = await fetchHome({
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
            if (response.message) {
                localStorage.removeItem('token')
                navigate(login)
                return
            }
            const {economic_prediction, exchange_rates, username} = response
            setJoke(economic_prediction)
            setRate(exchange_rates)
            setUserName(username)
        }
        getData()
        console.log(1)
    }, [])

    return (
        <Container>
            <Row>
                <Col xs={12} className="mt-5 " >
                <div className="bg-main main-container box-shaddow p-3">
                    <h1>Dashboard</h1>
                    {userName && <h3>Вітаємо, {userName}!</h3>}
                </div>
                    
                </Col>
            </Row>
            <Row className="d-flex justify-content-between">
                <Col xs={12} md={4} className="mt-5">
                    <div className="bg-main main-container box-shaddow p-3">
                        <h3 className="">Жарт для підняття настрою:</h3>
                        {joke && (
                            <p>{joke}</p>
                        )}
                        
                    </div>
                    
                </Col>
                <Col xs={12} md={4} className="mt-5">
                    <div className="bg-main main-container box-shaddow p-3">
                        <h3>Курс валют</h3>
                        {rate && (
                            <div>
                                <div className="d-flex align-items-center">
                                    <span>{<DOLLARIcon/>}</span>
                                    <span>{rate.USD}</span>
                                    <span>-</span>
                                    <span>{<EURIcon/>}</span>
                                    <span>{rate.EUR}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span>{<DOLLARIcon/>}</span>
                                    <span>{rate.USD}</span>
                                    <span>-</span>
                                    <span>{<UAHIcon/>}</span>
                                    <span>{rate.UAH}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span>{<EURIcon/>}</span>
                                    <span>1</span>
                                    <span>-</span>
                                    <span>{<UAHIcon/>}</span>
                                    <span>{Number(rate.UAH / (rate.USD / rate.EUR)).toFixed(4)}</span>
                                </div>
                            </div>

                        )}
                    </div>
                </Col>
                <Col xs={12} md={4} className="mt-5">
                    <div className="bg-main main-container box-shaddow p-3">
                        <h1>Papers</h1>
                        
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard