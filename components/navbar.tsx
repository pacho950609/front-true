import { Navbar, Container, Nav } from 'react-bootstrap';
import { useUser } from '../hooks/useUser';
import { useRouter } from 'next/router';

export const NavbarL = () => {
  const { user, logOut } = useUser();
  const router = useRouter();

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand> App {user?.email ? `- ${user?.email}` : ''} </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link
            hidden={user && !user?.email}
            onClick={() => router.push(
              {
                pathname: '/',
              },
              undefined,
              { shallow: true },
            )}
          >
            Operations
          </Nav.Link>
          <Nav.Link
            hidden={user && !user?.email}
            onClick={() => router.push(
              {
                pathname: '/records',
              },
              undefined,
              { shallow: true },
            )}
          >
            Records
          </Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"> </Nav>
          <Nav>
            <Nav.Link hidden={user && !user?.email} onClick={() => logOut()}> Log out </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};