import React, { useState, useEffect } from "react";
import { Col, Row, Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import agenciesService from "../../services/ecfr/ecfrServices";
import {EcfrAgenciesCardPane} from "./agenciesPane/ecfrAgenciesCardPane";
import '../../css/BasicComponentList.css';
import '../../css/Divider.css'



function EcfrFeed() {
    const [agencies, setAgencies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [emptyArray, setIsEmptyArray] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        retrieveAgencies();
    }, []);

    const retrieveAgencies = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let response = await agenciesService.getAgencies();
            setAgencies(response.data.agencies);

            if (!Array.isArray(response.data.agencies) || !response.data.agencies.length) {
                setIsEmptyArray(true);
            } else {
                setIsEmptyArray(false);
            }


        } catch (error) {
            console.error("An error occurred while fetching stored agencies: " + error);
            setError(error.message || "Failed to load agencies data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <Container>
                {error && (
                    <Row className="justify-content-center mt-5">
                        <Col md={8} className="text-center">
                            <Alert variant="danger" className="p-4">
                                <Alert.Heading>Error Loading Data</Alert.Heading>
                                <p>{error}</p>
                                <hr />
                                <div className="d-flex justify-content-center">
                                    <Button variant="outline-danger" onClick={retrieveAgencies}>
                                        Try Again
                                    </Button>
                                </div>
                            </Alert>
                        </Col>
                    </Row>
                )}

                {isLoading ? (
                        <Row className="justify-content-center mt-5">
                            <Col md={6} className="text-center">
                                <Card bg="dark" text="white" className="p-5">
                                    <Card.Body>
                                        <Spinner animation="border" role="status" size="lg" className="mb-3" />
                                        <h4>Loading Agencies Data...</h4>
                                        <p className="text-muted mb-0">Please wait while we fetch the latest eCFR agencies information.</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )
                    : !error && (
                    emptyArray ?
                        <Row className="justify-content-center mt-5">
                            <Col md={8} className="text-center">
                                <Card bg="dark" text="white" className="p-4">
                                    <Card.Body>
                                        <div className="mb-4">
                                            <i className="fas fa-database" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                                        </div>
                                        <h3 className="mb-3">No Agencies Data Available</h3>
                                        <p className="text-muted mb-4">
                                            It looks like there's no agencies data in the database yet.
                                            You'll need to download the data first to get started.
                                        </p>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={() => window.location.href = '/download'}
                                        >
                                            Download Agencies Data
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        :
                        <>
                            <Row className="mb-3">
                                <Col>
                                    <h2 className="text-light">eCFR Agencies ({agencies.length})</h2>
                                    <p className="text-muted">Browse through the federal agencies and their regulatory information.</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{height: "75vh", overflowY: "auto" }}>
                                    {agencies.map((agency) => (
                                        <EcfrAgenciesCardPane agencies={agency} key={agency.id} />
                                    ))}
                                </Col>
                            </Row>
                        </>
                )}
            </Container>
        </div>
    );
};
export default EcfrFeed;
