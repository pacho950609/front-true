import { useEffect, useState } from 'react';
import { Form, Button, Col, Row, } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash'
import { API_URL } from '../context/userContext';
import { useUser } from '../hooks/useUser';

export enum OperationType {
    ADDITION = 'addition',
    SUBTRACTION = 'subtraction',
    MULTIPLICATION = 'multiplication',
    DIVISION = 'division',
    SQUARE_ROOT = 'squareRoot',
    RANDOM_STRING = 'randomString',
}

export const operationDataMapper = new Map<OperationType, { label:string, path:string, numberOfParams: number }>([
    [OperationType.ADDITION, {
        label: 'Addition',
        path: 'addition',
        numberOfParams: 2
    }],
    [OperationType.SUBTRACTION, {
        label: 'Subtraction',
        path: 'subtraction',
        numberOfParams: 2
    }],
    [OperationType.MULTIPLICATION, {
        label: 'Multiplication',
        path: 'multiplication',
        numberOfParams: 2
    }],
    [OperationType.DIVISION, {
        label: 'Division',
        path: 'division',
        numberOfParams: 2
    }],
    [OperationType.SQUARE_ROOT, {
        label: 'Square Root',
        path: 'square-root',
        numberOfParams: 1
    }],
    [OperationType.RANDOM_STRING, {
        label: 'Random string',
        path: 'random-string',
        numberOfParams: 0
    }],

])

export const Operation = () => {
    const { user } = useUser();
    const [operationType, setOperationType] = useState<OperationType>(OperationType.ADDITION);
    const [operationNumber1, setOperationNumber1] = useState<number>(0);
    const [operationNumber2, setOperationNumber2] = useState<number>(0);
    const [operationResponse, setOperationResponse] = useState<string>('');
    const [pointErrorMsg, setPointErrorMsg] = useState<string>('');
    const [userBalance, setUserBalance] = useState<number>(0);
    const [operations, setOperations] = useState<{ type: OperationType, cost:number }[]>([]);

    useEffect(() => {
        if(user?.token) {
            axios.get<{ balance: number }>(`${API_URL}/v1/balance`, {
                headers: {
                    Authorization: user?.token,
                }
            }).then((res) => {
                setUserBalance(res.data.balance);
            })
        }
    }, [user]);

    useEffect(() => {
        axios.get<{ operations: { type: OperationType, cost:number }[] }>(`${API_URL}/v1/operations`).then((res) => {
            setOperations(res.data.operations);
        })
    }, []);

    const canOperate = () => {
        if (operationNumber2 === 0 && operationType === OperationType.DIVISION) {
            return false
        }
        return true
    }

    const operate = async () => {
        const body:{
            number1?: number;
            number2?: number;
        } = {};

        if(operationDataMapper.get(operationType).numberOfParams === 1) {
            body.number1 = operationNumber1;
        }

        if(operationDataMapper.get(operationType).numberOfParams === 2) {
            body.number1 = operationNumber1;
            body.number2 = operationNumber2;
        }

        try {
            const { path } = operationDataMapper.get(operationType)
            const response = await axios.post<{operationRes: any, record: { amount: number; }}>(`${API_URL}/v1/${path}`, body, {
                headers: {
                    Authorization: user.token
                }
            })
            const { operationRes, record } = response.data;
            setOperationResponse(operationRes.toString());
            setPointErrorMsg('');
            setUserBalance(userBalance - record.amount);
        } catch (error: any) {
            setOperationResponse('');
            if(error?.response?.data?.error) {
                setPointErrorMsg(error?.response?.data?.error);
            } else {
                setPointErrorMsg(error?.message ?? 'Theres an error');
            }
        }
    }

    return (
        <Form style={({marginTop: '15px'})}>
            <Form.Group as={Row} className="mb-3">
                <Form.Label> <h4><b> Operation ( Balance: ${ userBalance === 0 ? '-' : userBalance } ) </b></h4></Form.Label>
                <br/>
                <Form.Label column sm="4">
                    Type
                </Form.Label>
                <Col sm="8">
                    <Form.Select aria-label="Default select example" value={operationType} onChange={(ot) => setOperationType(ot.target.value as OperationType)}>
                        {
                            operations?.map(operation =>
                                <option key={operation.type} value={operation.type}>{`${operationDataMapper.get(operation.type).label} (cost: ${operation.cost})`}</option>
                            )
                        }
                    </Form.Select>
                </Col>
                <br/>
                <br/>
                <Form.Label column sm="4">
                    Operation number 1
                </Form.Label>
                <Col sm="8">
                    <Form.Control type="number" disabled={operationDataMapper.get(operationType).numberOfParams < 1} value={operationNumber1} onChange={(value) => setOperationNumber1(Number(value.target.value))} />
                </Col>
                <br/>
                <br/>
                <Form.Label column sm="4">
                    Operation number 2
                </Form.Label>
                <Col sm="8">
                    <Form.Control type="number"  disabled={operationDataMapper.get(operationType).numberOfParams < 2} value={operationNumber2} onChange={(value) => setOperationNumber2(Number(value.target.value))} />
                </Col>
                <br/>
                <br/>
                <Col sm="3" style={({marginTop: '8px'})}>
                    <Button variant="primary" onClick={() => operate()} disabled={!canOperate()}>
                        Operate
                    </Button>
                </Col>
                <br/>
                <br/>
                <Form.Label column sm="12">
                    <label> <b> { operationResponse ? `Your response is: ${ operationResponse }` : ''} </b> </label>
                    <label style={({color: 'red'})}>  <b>  { pointErrorMsg ?? '' } </b> </label>
                </Form.Label>
            </Form.Group>
        </Form>
    );
};