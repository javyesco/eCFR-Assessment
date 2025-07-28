import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {
    ECFR_WORD_COUNT,
    ECFR_CHECKSUMS,
    ECFR_HISTORY,
    ECFR_COMPLEXITY,
    ECFR_AGENCIES, ECFR_DOWNLOAD
} from "../../constants/routes";
import {Col, NavDropdown, Row} from "react-bootstrap";
import React, { useContext } from "react";
import { Divider} from '@chakra-ui/react'
import { Link } from 'react-router-dom';

function NavBar({ isMobile }) {
    return (
        <Navbar expand="lg" variant="dark" bg="dark" style={{margin: "0 0 5% 0"}}>
            <Container fluid>
                <Navbar.Brand as={Link} to={ECFR_AGENCIES}>
                    HOME
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav variant={"underline"} className={`me-auto my-2 my-lg-0 navbar-underline`} fill>
                        <NavDropdown
                            id="nav-dropdown-dark-example"
                            title={<span>TOOLS</span>}
                            menuVariant="dark"
                        >
                            <Link to={ECFR_DOWNLOAD} className="dropdown-item">Download Agencies</Link>
                            <Link to={ECFR_WORD_COUNT} className="dropdown-item">Word Count</Link>
                            <Link to={ECFR_CHECKSUMS} className="dropdown-item">Checksums</Link>
                            <Link to={ECFR_HISTORY} className="dropdown-item">Historical Changes</Link>
                            <Link to={ECFR_COMPLEXITY} className="dropdown-item">Complexity</Link>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;