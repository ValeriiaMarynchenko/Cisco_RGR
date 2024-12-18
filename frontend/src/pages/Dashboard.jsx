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
    const [bonds, setBonds] = useState([])
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
            const {economic_prediction, exchange_rates, username, stock_prices} = response
            setJoke(economic_prediction)
            setRate(exchange_rates)
            setUserName(username)
            setBonds(stock_prices)
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
                            <span>{joke}</span>
                        )}
                        
                    </div>
                    
                </Col>
                <Col xs={12} md={4} className="mt-5">
                    <div className="bg-main main-container box-shaddow p-3">
                        <h3>Курс валют</h3>
                        {rate && (
                            <div>
                                <Row className="">
                                    <Col md={4} className="d-flex align-items-center justify-content-start">
                                        <span><DOLLARIcon/>{" "}{rate.USD}</span>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-center justify-content-center"><span></span></Col>
                                    <Col md={6} className="d-flex align-items-center flex-row justify-content-end">
                                        <span><EURIcon/>{" "}{rate.EUR}</span>
                                    </Col>
                                </Row>
                                <Row className="">
                                    <Col md={4} className="d-flex align-items-center justify-content-start">
                                        <span><DOLLARIcon/>{" "}{rate.USD}</span>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-center justify-content-center"><span></span></Col>
                                    <Col md={6} className="d-flex align-items-center flex-row justify-content-end">
                                        <span><UAHIcon/>{" "}{rate.UAH}</span>
                                    </Col>
                                </Row>
                                <Row className="">
                                    <Col md={4} className="d-flex align-items-center justify-content-start"><span>{<EURIcon/>}{" "}1</span></Col>
                                    <Col md={2} className="d-flex align-items-center justify-content-center"><span></span></Col>
                                    <Col md={6} className="d-flex align-items-center flex-row justify-content-end">
                                        <span><UAHIcon/>{" "}{Number(rate.UAH / (rate.USD / rate.EUR)).toFixed(4)}</span>
                                    </Col>
                                </Row>
                            </div>

                        )}
                    </div>
                </Col>
                <Col xs={12} md={4} className="mt-5">
                    <div className="bg-main main-container box-shaddow p-3">
                        <h3>Акції та ціни</h3>
                        {bonds?.length > 0 && (
                            <div>
                                {bonds.map(({ticker, price}) => {
                                    return (
                                        <Row className="">
                                            <Col md={4} className="d-flex align-items-center justify-content-start"><span>{ticker}</span></Col>
                                            <Col md={2} className="d-flex align-items-center justify-content-center"><span></span></Col>
                                            <Col md={6} className="d-flex align-items-center flex-row justify-content-end">
                                                <span>{Number(price.toFixed(4))}</span>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        ) }
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard