import type { NextPage } from 'next'
import { Col, Container, Row } from 'react-bootstrap'
import { useUser } from '../hooks/useUser'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Operation } from '../components/opertation';
import { Records } from '../components/records';

const Home: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect( () => {
    if(user && !user.token) {
      router.push(
        {
          pathname: '/logIn',
        },
        undefined,
        { shallow: true },
      );
    }
  }, [user])

  return (
    <Container>
      <Row style={({marginTop: '15px'})}>
        <Records></Records>
      </Row>
    </Container>
  )
}

export default Home
