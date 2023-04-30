import { useEffect, useState } from 'react';
import { Form, Button, Col, Row, Table, Pagination, InputGroup, Container, } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash'
import { API_URL } from '../context/userContext';
import { useUser } from '../hooks/useUser';
import { OperationType } from './opertation';
import moment from 'moment';

export enum OperationResponse {
    OK = 'OK',
    ERROR = 'ERROR',
}

export enum OrderColumn {
    DATE = 'date',
    TYPE = 'type',
    OPERATION_RESPONSE = 'operationResponse',
}

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

interface Record {
    id: string;
    type: OperationType;
    userBalance: number;
    operationResponse: OperationResponse;
    amount: number;
    date: string;
}

export const Records = () => {
    const { user } = useUser();
    const [page, setPage] = useState<number>(1);
    const [pagesNumber, setPagesNumber] = useState<number>(1);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(3);
    const [operationResponse, setOperationResponse] = useState<OperationResponse>(null);
    const [type, setType] = useState<OperationType>(null);
    const [date, setDate] = useState<string>(null);
    const [orderByCol, setOrderByCol] = useState<OrderColumn>(null);
    const [orderByType, setOrderByType] = useState<OrderType>(null);
    const [records, setRecords] = useState<Record[]>([]);
    const [filters, setFilters] = useState<{
        recordsPerPage: number;
        operationResponse?: OperationResponse;
        type?: OperationType;
        date?: string;
        orderByCol?: OrderColumn;
        orderByType?: OrderType;
    }>({
        recordsPerPage: 3
    });

    const getRecordsNumber = async (params) => {
        return axios.get<{ records: Record[], pages: number }>(`${API_URL}/v1/records-number`, {
            headers: {
                Authorization: user?.token,
            },
            params
        });
    }

    useEffect(() => {
        if (user?.token) {
            getRecordsNumber({ recordsPerPage }).then((res) => {
                setRecords(res.data.records);
                setPagesNumber(res.data.pages);
            })
        }
    }, [user]);

    const getPageRecords = async (page: number) => {
        const response = await axios.get<{ records: Record[] }>(`${API_URL}/v1/records`, {
            headers: {
                Authorization: user?.token,
            },
            params: {
                recordsPerPage,
                page,
                operationResponse,
                type,
                date,
                orderByCol,
                orderByType
            }
        });
        setRecords(response.data.records);
        setPage(page);
    }

    const getPaginationItems = () => {
        const items = [];
        for (let number = 1; number <= pagesNumber; number++) {
            items.push(
                <Pagination.Item key={number} active={number === page} onClick={(e) => getPageRecords(Number((e.target as any).text))}>
                    {number}
                </Pagination.Item>,
            );
        }
        return items;
    }

    const query = async () => {
        const response = await getRecordsNumber({ ...filters });
        if (filters.recordsPerPage) {
            setRecordsPerPage(filters.recordsPerPage);
        }
        if (filters.type) {
            setType(filters.type);
        }
        if (filters.operationResponse) {
            setOperationResponse(filters.operationResponse);
        }
        if (filters.date) {
            setDate(filters.date)
        }
        if (filters.orderByType) {
            setOrderByType(filters.orderByType)
        }
        if (filters.orderByCol) {
            setOrderByCol(filters.orderByCol)
        }
        setRecords(response.data.records);
        setPage(1);
        setPagesNumber(response.data.pages);
    }

    const deleteRecord = async (id: string) => {
        await axios.delete(`${API_URL}/v1/record/${id}`, {
            headers: {
                Authorization: user?.token,
            },
        });
        const response = await getRecordsNumber({
            recordsPerPage,
            operationResponse,
            type,
            date,
            orderByCol,
            orderByType
        });
        setRecords(response.data.records);
        setPage(1);
        setPagesNumber(response.data.pages);
    }

    return (
        <>
            <h4> <b> Records </b> </h4>
            <br />
            <br />
            <h5> Filters </h5>
            <br />
            <Container>
                <Row>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Records per page</InputGroup.Text>
                            <Form.Control
                                type="number"
                                value={filters.recordsPerPage}
                                onChange={(ot) => setFilters({ ...filters, recordsPerPage: Number(ot.target.value) })}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"> Response</InputGroup.Text>
                            <Form.Select
                                aria-label="Default select example"
                                value={filters.operationResponse ?? "Select"}
                                onChange={(or) => or.target.value === 'Select' ? setFilters({ ...(_.omit(filters, 'operationResponse'))}) : setFilters({ ...filters, operationResponse: or.target.value as OperationResponse })}
                            >
                                <option> Select </option>
                                {Object.values(OperationResponse).map(or => <option key={or}> {or} </option>)}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"> Type </InputGroup.Text>
                            <Form.Select
                                aria-label="Default select example"
                                value={filters.type ?? "Select"}
                                onChange={(or) => or.target.value === 'Select' ? setFilters({ ...(_.omit(filters, 'type'))}) : setFilters({ ...filters, type: or.target.value as OperationType })}
                            >
                                <option> Select </option>
                                {Object.values(OperationType).map(ot => <option key={ot}> {ot} </option>)}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"> Date </InputGroup.Text>
                            <Form.Control
                                type="date"
                                value={filters.date ?? ''}
                                onChange={(or) => or.target.value === '' ? setFilters({ ...(_.omit(filters, 'date'))}) : setFilters({ ...filters, date: or.target.value })}
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
            <h5> Order </h5>
            <br />
            <Container>
                <Row>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Column</InputGroup.Text>
                            <Form.Select
                                aria-label="Default select example"
                                value={filters.orderByCol ?? "Select"}
                                onChange={(or) => or.target.value === 'Select' ? setFilters({ ...(_.omit(filters, 'orderByCol'))}) : setFilters({ ...filters, orderByCol: or.target.value as OrderColumn })}
                            >
                                <option > Select </option>
                                {Object.values(OrderColumn).map(oc => <option key={oc}> {oc} </option>)}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col xs={3}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"> Type </InputGroup.Text>
                            <Form.Select
                                aria-label="Default select example"
                                value={filters.orderByType ?? "Select"}
                                onChange={(or) => or.target.value === 'Select' ? setFilters({ ...(_.omit(filters, 'orderByType'))}) : setFilters({ ...filters, orderByType: or.target.value as OrderType })}
                            >
                                <option > Select </option>
                                {Object.values(OrderType).map(ot => <option key={ot}> {ot} </option>)}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Col sm="3" style={({ marginTop: '8px' })}>
                <Button variant="primary" onClick={() => query()}>
                    Query
                </Button>
            </Col>
            <br />
            <br />
            <br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Balance</th>
                        <th>Response</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(((r, index) => {
                        return (
                            <tr key={r.id}>
                                <td> {(index + 1) + ((page - 1) * recordsPerPage)} </td>
                                <td> {r.type} </td>
                                <td> {r.userBalance} </td>
                                <td> {r.operationResponse} </td>
                                <td> {r.amount} </td>
                                <td> {moment(r.date).utc().format('YYYY-MM-DD')} </td>
                                <td>                 
                                    <Button variant="danger" onClick={() => deleteRecord(r.id)}>
                                        Delete
                                    </Button> 
                                </td>
                            </tr>
                        )
                    }))}
                </tbody>
            </Table>
            <Pagination hidden={!records.length}>
                {
                    getPaginationItems()
                }
            </Pagination>
        </>
    );
};