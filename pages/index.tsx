import type { NextPage } from 'next'
import { Container, Row } from 'react-bootstrap'
import { useUser } from '../hooks/useUser'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Operation } from '../components/opertation';

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
      <Row>
        <Operation></Operation>
      </Row>
    </Container>
  )
}

export default Home
